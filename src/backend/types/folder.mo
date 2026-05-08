import Common "common";

module {
  public type Folder = {
    id : Common.FolderId;
    userId : Common.UserId;
    var name : Text;
    var icon : Text;
    createdAt : Common.Timestamp;
  };

  public type FolderView = {
    id : Common.FolderId;
    userId : Common.UserId;
    name : Text;
    icon : Text;
    createdAt : Common.Timestamp;
  };

  public type CreateFolderArgs = {
    name : Text;
    icon : Text;
  };
};
