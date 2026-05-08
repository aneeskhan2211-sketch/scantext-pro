import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Common "types/common";
import UserTypes "types/user";
import ScanTypes "types/scan";
import FolderTypes "types/folder";
import SubTypes "types/subscription";
import UsageTypes "types/usage";
import ActivityTypes "types/activity";
import UserApi "mixins/user-api";
import ScanApi "mixins/scan-api";
import FolderApi "mixins/folder-api";
import SubscriptionApi "mixins/subscription-api";
import UsageApi "mixins/usage-api";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Object storage
  include MixinObjectStorage();

  // Domain state
  let users = Map.empty<Common.UserId, UserTypes.User>();
  let scans = Map.empty<Common.ScanId, ScanTypes.Scan>();
  let folders = Map.empty<Common.FolderId, FolderTypes.Folder>();
  let subscriptions = Map.empty<Common.UserId, SubTypes.Subscription>();
  let usageLimits = Map.empty<Common.UserId, UsageTypes.UsageLimits>();
  let activities = Map.empty<Common.ActivityId, ActivityTypes.Activity>();

  // Sequence counters wrapped in a record so mixins share by reference
  let seqState = {
    var nextScanSeq : Nat = 0;
    var nextFolderSeq : Nat = 0;
    var nextSubSeq : Nat = 0;
    var nextActivityId : Nat = 0;
  };

  // Domain API mixins
  include UserApi(accessControlState, users, scans, folders, subscriptions, usageLimits, activities);
  include ScanApi(accessControlState, scans, usageLimits, users, activities, seqState);
  include FolderApi(accessControlState, folders, activities, seqState);
  include SubscriptionApi(accessControlState, subscriptions, users, activities, seqState);
  include UsageApi(accessControlState, usageLimits, users);
};
