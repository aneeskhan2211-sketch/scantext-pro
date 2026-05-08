import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import FolderTypes "../types/folder";
import ActivityTypes "../types/activity";
import FolderLib "../lib/folder";

mixin (
  accessControlState : AccessControl.AccessControlState,
  folders : Map.Map<Common.FolderId, FolderTypes.Folder>,
  activities : Map.Map<Common.ActivityId, ActivityTypes.Activity>,
  state : { var nextFolderSeq : Nat },
) {
  /// Create a new folder for caller
  public shared ({ caller }) func createFolder(args : FolderTypes.CreateFolderArgs) : async FolderTypes.FolderView {
    FolderLib.create(folders, caller, args, state);
  };

  /// List all folders owned by caller
  public query ({ caller }) func listFolders() : async [FolderTypes.FolderView] {
    FolderLib.list(folders, caller);
  };

  /// Delete a folder owned by caller
  public shared ({ caller }) func deleteFolder(folderId : Common.FolderId) : async () {
    FolderLib.delete(folders, caller, folderId);
  };
};
