import Common "common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type ScanType = { #document; #receipt; #card; #other };

  public type Scan = {
    id : Common.ScanId;
    userId : Common.UserId;
    image : Storage.ExternalBlob;
    var extractedText : Text;
    var language : Text;
    var folderId : ?Common.FolderId;
    var tags : [Text];
    createdAt : Common.Timestamp;
    var updatedAt : Common.Timestamp;
    var isFavorite : Bool;
    var isPinned : Bool;
    var isDeleted : Bool;
    var exportCount : Int;
    scanType : ScanType;
    var confidenceScore : Float;
  };

  // Shared-safe view
  public type ScanView = {
    id : Common.ScanId;
    userId : Common.UserId;
    image : Storage.ExternalBlob;
    extractedText : Text;
    language : Text;
    folderId : ?Common.FolderId;
    tags : [Text];
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
    isFavorite : Bool;
    isPinned : Bool;
    isDeleted : Bool;
    exportCount : Int;
    scanType : ScanType;
    confidenceScore : Float;
  };

  public type CreateScanArgs = {
    image : Storage.ExternalBlob;
    extractedText : Text;
    language : Text;
    folderId : ?Common.FolderId;
    tags : [Text];
    scanType : ScanType;
    confidenceScore : Float;
  };

  public type UpdateScanArgs = {
    id : Common.ScanId;
    extractedText : ?Text;
    language : ?Text;
    folderId : ?Common.FolderId;
    tags : ?[Text];
    isFavorite : ?Bool;
    isPinned : ?Bool;
    exportCount : ?Int;
    confidenceScore : ?Float;
  };

  public type ListScansArgs = {
    includeDeleted : Bool;
    folderId : ?Common.FolderId;
    offset : Nat;
    limit : Nat;
  };

  public type ListScansResult = {
    scans : [ScanView];
    total : Nat;
  };
};
