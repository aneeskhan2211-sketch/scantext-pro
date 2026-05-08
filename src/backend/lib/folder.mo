import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import FolderTypes "../types/folder";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Nat "mo:core/Nat";

module {
  public func create(
    folders : Map.Map<Common.FolderId, FolderTypes.Folder>,
    caller : Principal,
    args : FolderTypes.CreateFolderArgs,
    seqState : { var nextFolderSeq : Nat },
  ) : FolderTypes.FolderView {
    let now = Time.now();
    seqState.nextFolderSeq += 1;
    let folderId = "folder-" # now.toText() # "-" # seqState.nextFolderSeq.toText();
    let folder : FolderTypes.Folder = {
      id = folderId;
      userId = caller;
      var name = args.name;
      var icon = args.icon;
      createdAt = now;
    };
    folders.add(folderId, folder);
    toView(folder);
  };

  public func list(
    folders : Map.Map<Common.FolderId, FolderTypes.Folder>,
    caller : Principal,
  ) : [FolderTypes.FolderView] {
    var result : [FolderTypes.FolderView] = [];
    for ((_, folder) in folders.entries()) {
      if (Principal.equal(folder.userId, caller)) {
        result := result.concat([toView(folder)]);
      };
    };
    result;
  };

  public func delete(
    folders : Map.Map<Common.FolderId, FolderTypes.Folder>,
    caller : Principal,
    folderId : Common.FolderId,
  ) : () {
    switch (folders.get(folderId)) {
      case (?folder) {
        if (not Principal.equal(folder.userId, caller)) {
          Runtime.trap("unauthorized");
        };
        folders.remove(folderId);
      };
      case null Runtime.trap("not_found");
    };
  };

  public func toView(folder : FolderTypes.Folder) : FolderTypes.FolderView {
    {
      id = folder.id;
      userId = folder.userId;
      name = folder.name;
      icon = folder.icon;
      createdAt = folder.createdAt;
    };
  };
};
