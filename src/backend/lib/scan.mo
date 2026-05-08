import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import ScanTypes "../types/scan";
import UsageTypes "../types/usage";
import UserTypes "../types/user";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {
  public func create(
    scans : Map.Map<Common.ScanId, ScanTypes.Scan>,
    usageLimits : Map.Map<Common.UserId, UsageTypes.UsageLimits>,
    users : Map.Map<Common.UserId, UserTypes.User>,
    caller : Principal,
    args : ScanTypes.CreateScanArgs,
    seqState : { var nextScanSeq : Nat },
  ) : ScanTypes.ScanView {
    // Enforce daily limit for free users
    let isPremium = switch (users.get(caller)) {
      case (?u) u.plan == #premium;
      case null false;
    };
    if (not isPremium) {
      let usage = switch (usageLimits.get(caller)) {
        case (?u) u;
        case null {
          let u : UsageTypes.UsageLimits = {
            userId = caller;
            var scansToday = 0;
            var lastResetDate = Time.now();
          };
          usageLimits.add(caller, u);
          u;
        };
      };
      if (usage.scansToday >= UsageTypes.FREE_DAILY_SCAN_LIMIT) {
        Runtime.trap("limit_exceeded");
      };
    };
    // Generate scan id
    let now = Time.now();
    seqState.nextScanSeq += 1;
    let scanId = "scan-" # now.toText() # "-" # seqState.nextScanSeq.toText();
    let scan : ScanTypes.Scan = {
      id = scanId;
      userId = caller;
      image = args.image;
      var extractedText = args.extractedText;
      var language = args.language;
      var folderId = args.folderId;
      var tags = args.tags;
      createdAt = now;
      var updatedAt = now;
      var isFavorite = false;
      var isPinned = false;
      var isDeleted = false;
      var exportCount = 0;
      scanType = args.scanType;
      var confidenceScore = args.confidenceScore;
    };
    scans.add(scanId, scan);
    // Increment usage and user totals
    switch (usageLimits.get(caller)) {
      case (?u) { u.scansToday += 1 };
      case null {};
    };
    switch (users.get(caller)) {
      case (?u) {
        u.scansToday += 1;
        u.totalScans += 1;
      };
      case null {};
    };
    toView(scan);
  };

  public func update(
    scans : Map.Map<Common.ScanId, ScanTypes.Scan>,
    caller : Principal,
    args : ScanTypes.UpdateScanArgs,
  ) : ScanTypes.ScanView {
    let scan = switch (scans.get(args.id)) {
      case (?s) s;
      case null Runtime.trap("not_found");
    };
    if (not Principal.equal(scan.userId, caller)) {
      Runtime.trap("unauthorized");
    };
    switch (args.extractedText) {
      case (?t) { scan.extractedText := t };
      case null {};
    };
    switch (args.language) {
      case (?l) { scan.language := l };
      case null {};
    };
    switch (args.folderId) {
      case (?f) { scan.folderId := ?f };
      case null {};
    };
    switch (args.tags) {
      case (?t) { scan.tags := t };
      case null {};
    };
    switch (args.isFavorite) {
      case (?v) { scan.isFavorite := v };
      case null {};
    };
    switch (args.isPinned) {
      case (?v) { scan.isPinned := v };
      case null {};
    };
    switch (args.exportCount) {
      case (?v) { scan.exportCount := v };
      case null {};
    };
    switch (args.confidenceScore) {
      case (?v) { scan.confidenceScore := v };
      case null {};
    };
    scan.updatedAt := Time.now();
    toView(scan);
  };

  public func softDelete(
    scans : Map.Map<Common.ScanId, ScanTypes.Scan>,
    caller : Principal,
    scanId : Common.ScanId,
  ) : () {
    let scan = switch (scans.get(scanId)) {
      case (?s) s;
      case null Runtime.trap("not_found");
    };
    if (not Principal.equal(scan.userId, caller)) {
      Runtime.trap("unauthorized");
    };
    scan.isDeleted := true;
    scan.updatedAt := Time.now();
  };

  public func restore(
    scans : Map.Map<Common.ScanId, ScanTypes.Scan>,
    caller : Principal,
    scanId : Common.ScanId,
  ) : () {
    let scan = switch (scans.get(scanId)) {
      case (?s) s;
      case null Runtime.trap("not_found");
    };
    if (not Principal.equal(scan.userId, caller)) {
      Runtime.trap("unauthorized");
    };
    scan.isDeleted := false;
    scan.updatedAt := Time.now();
  };

  public func get(
    scans : Map.Map<Common.ScanId, ScanTypes.Scan>,
    caller : Principal,
    scanId : Common.ScanId,
  ) : ?ScanTypes.ScanView {
    switch (scans.get(scanId)) {
      case (?s) {
        if (Principal.equal(s.userId, caller)) {
          ?toView(s);
        } else null;
      };
      case null null;
    };
  };

  public func list(
    scans : Map.Map<Common.ScanId, ScanTypes.Scan>,
    caller : Principal,
    args : ScanTypes.ListScansArgs,
  ) : ScanTypes.ListScansResult {
    var filtered : [ScanTypes.ScanView] = [];
    for ((_, scan) in scans.entries()) {
      if (Principal.equal(scan.userId, caller)) {
        if (args.includeDeleted or not scan.isDeleted) {
          let folderMatch = switch (args.folderId) {
            case (?fid) {
              switch (scan.folderId) {
                case (?sf) sf == fid;
                case null false;
              };
            };
            case null true;
          };
          if (folderMatch) {
            filtered := filtered.concat([toView(scan)]);
          };
        };
      };
    };
    let total = filtered.size();
    let start = if (args.offset >= total) total else args.offset;
    let end_ = if (start + args.limit > total) total else start + args.limit;
    let page = filtered.sliceToArray(start.toInt(), end_.toInt());
    { scans = page; total };
  };

  public func search(
    scans : Map.Map<Common.ScanId, ScanTypes.Scan>,
    caller : Principal,
    searchQuery : Text,
  ) : [ScanTypes.ScanView] {
    let lower = searchQuery.toLower();
    var results : [ScanTypes.ScanView] = [];
    for ((_, scan) in scans.entries()) {
      if (Principal.equal(scan.userId, caller) and not scan.isDeleted) {
        if (scan.extractedText.toLower().contains(#text lower)) {
          results := results.concat([toView(scan)]);
        };
      };
    };
    results;
  };

  public func toView(scan : ScanTypes.Scan) : ScanTypes.ScanView {
    {
      id = scan.id;
      userId = scan.userId;
      image = scan.image;
      extractedText = scan.extractedText;
      language = scan.language;
      folderId = scan.folderId;
      tags = scan.tags;
      createdAt = scan.createdAt;
      updatedAt = scan.updatedAt;
      isFavorite = scan.isFavorite;
      isPinned = scan.isPinned;
      isDeleted = scan.isDeleted;
      exportCount = scan.exportCount;
      scanType = scan.scanType;
      confidenceScore = scan.confidenceScore;
    };
  };
};
