var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { P as ProtocolError, T as TimeoutWaitingForResponseErrorCode, M as utf8ToBytes, N as ExternalError, O as MissingRootKeyErrorCode, Q as Certificate, U as lookupResultToBuffer, V as RequestStatusResponseStatus, W as UnknownError, X as RequestStatusDoneNoReplyErrorCode, Y as RejectError, Z as CertifiedRejectErrorCode, $ as UNREACHABLE_ERROR, a0 as InputError, a1 as InvalidReadStateRequestErrorCode, a2 as ReadRequestType, a3 as Principal, a4 as IDL, a5 as MissingCanisterIdErrorCode, a6 as HttpAgent, a7 as encode, a8 as QueryResponseStatus, a9 as UncertifiedRejectErrorCode, aa as isV3ResponseBody, ab as isV2ResponseBody, ac as UncertifiedRejectUpdateErrorCode, ad as UnexpectedErrorCode, ae as decode, af as Record, ag as Opt, ah as Variant, ai as Vec, aj as Service, ak as Func, al as Text, am as Nat8, an as Nat, ao as Bool, ap as Null, aq as Int, ar as Principal$1, as as Float64 } from "./index-CLbxCJ0J.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a = agent.createReadStateRequest) == null ? void 0 : _a.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a, _b;
      options = {
        ...options,
        ...(_b = (_a = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b.call(_a, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a, _b;
      options = {
        ...options,
        ...(_b = (_a = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b.call(_a, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
const _ImmutableObjectStorageCreateCertificateResult = Record({
  "method": Text,
  "blob_hash": Text
});
const _ImmutableObjectStorageRefillInformation = Record({
  "proposed_top_up_amount": Opt(Nat)
});
const _ImmutableObjectStorageRefillResult = Record({
  "success": Opt(Bool),
  "topped_up_amount": Opt(Nat)
});
const UserRole = Variant({
  "admin": Null,
  "user": Null,
  "guest": Null
});
const UserId = Principal$1;
const Timestamp = Int;
const UsageLimitsView = Record({
  "scansToday": Int,
  "userId": UserId,
  "canScan": Bool,
  "dailyLimit": Int,
  "lastResetDate": Timestamp
});
const CreateFolderArgs = Record({
  "icon": Text,
  "name": Text
});
const FolderId = Text;
const FolderView = Record({
  "id": FolderId,
  "userId": UserId,
  "icon": Text,
  "name": Text,
  "createdAt": Timestamp
});
const UpsertSubscriptionArgs = Record({
  "stripeSubscriptionId": Opt(Text),
  "plan": Text,
  "currentPeriodEnd": Opt(Timestamp)
});
const SubscriptionId = Text;
const SubscriptionView = Record({
  "id": SubscriptionId,
  "stripeSubscriptionId": Opt(Text),
  "userId": UserId,
  "plan": Text,
  "currentPeriodEnd": Opt(Timestamp)
});
const ScanType$1 = Variant({
  "receipt": Null,
  "other": Null,
  "card": Null,
  "document": Null
});
const ExternalBlob$1 = Vec(Nat8);
const CreateScanArgs = Record({
  "scanType": ScanType$1,
  "tags": Vec(Text),
  "extractedText": Text,
  "confidenceScore": Float64,
  "language": Text,
  "image": ExternalBlob$1,
  "folderId": Opt(FolderId)
});
const ScanId = Text;
const ScanView = Record({
  "id": ScanId,
  "isDeleted": Bool,
  "scanType": ScanType$1,
  "userId": UserId,
  "createdAt": Timestamp,
  "tags": Vec(Text),
  "isFavorite": Bool,
  "extractedText": Text,
  "confidenceScore": Float64,
  "language": Text,
  "updatedAt": Timestamp,
  "image": ExternalBlob$1,
  "exportCount": Int,
  "folderId": Opt(FolderId),
  "isPinned": Bool
});
const UserPlan$1 = Variant({
  "premium": Null,
  "free": Null
});
const UserView = Record({
  "id": UserId,
  "scansToday": Int,
  "createdAt": Timestamp,
  "plan": UserPlan$1,
  "language": Text,
  "totalScans": Int,
  "updatedAt": Timestamp
});
const ListScansArgs = Record({
  "includeDeleted": Bool,
  "offset": Nat,
  "limit": Nat,
  "folderId": Opt(FolderId)
});
const ListScansResult = Record({
  "total": Nat,
  "scans": Vec(ScanView)
});
const UpdateScanArgs = Record({
  "id": ScanId,
  "tags": Opt(Vec(Text)),
  "isFavorite": Opt(Bool),
  "extractedText": Opt(Text),
  "confidenceScore": Opt(Float64),
  "language": Opt(Text),
  "exportCount": Opt(Int),
  "folderId": Opt(FolderId),
  "isPinned": Opt(Bool)
});
const UpdateUserArgs = Record({
  "plan": Opt(UserPlan$1),
  "language": Opt(Text)
});
Service({
  "_immutableObjectStorageBlobsAreLive": Func(
    [Vec(Vec(Nat8))],
    [Vec(Bool)],
    ["query"]
  ),
  "_immutableObjectStorageBlobsToDelete": Func(
    [],
    [Vec(Vec(Nat8))],
    ["query"]
  ),
  "_immutableObjectStorageConfirmBlobDeletion": Func(
    [Vec(Vec(Nat8))],
    [],
    []
  ),
  "_immutableObjectStorageCreateCertificate": Func(
    [Text],
    [_ImmutableObjectStorageCreateCertificateResult],
    []
  ),
  "_immutableObjectStorageRefillCashier": Func(
    [Opt(_ImmutableObjectStorageRefillInformation)],
    [_ImmutableObjectStorageRefillResult],
    []
  ),
  "_immutableObjectStorageUpdateGatewayPrincipals": Func([], [], []),
  "_initializeAccessControl": Func([], [], []),
  "assignCallerUserRole": Func([Principal$1, UserRole], [], []),
  "checkUsageLimit": Func([], [UsageLimitsView], []),
  "createFolder": Func([CreateFolderArgs], [FolderView], []),
  "createOrUpdateSubscription": Func(
    [UpsertSubscriptionArgs],
    [SubscriptionView],
    []
  ),
  "createScan": Func([CreateScanArgs], [ScanView], []),
  "deleteAccount": Func([], [], []),
  "deleteFolder": Func([FolderId], [], []),
  "deleteScan": Func([ScanId], [], []),
  "getCallerUserRole": Func([], [UserRole], ["query"]),
  "getOrCreateUser": Func([], [UserView], []),
  "getScan": Func([ScanId], [Opt(ScanView)], ["query"]),
  "getSubscription": Func([], [Opt(SubscriptionView)], ["query"]),
  "incrementScanCount": Func([], [], []),
  "isCallerAdmin": Func([], [Bool], ["query"]),
  "listFolders": Func([], [Vec(FolderView)], ["query"]),
  "listScans": Func([ListScansArgs], [ListScansResult], ["query"]),
  "resetDailyLimits": Func([], [], []),
  "restoreScan": Func([ScanId], [], []),
  "searchScans": Func([Text], [Vec(ScanView)], ["query"]),
  "updateScan": Func([UpdateScanArgs], [ScanView], []),
  "updateUser": Func([UpdateUserArgs], [UserView], [])
});
const idlFactory = ({ IDL: IDL2 }) => {
  const _ImmutableObjectStorageCreateCertificateResult2 = IDL2.Record({
    "method": IDL2.Text,
    "blob_hash": IDL2.Text
  });
  const _ImmutableObjectStorageRefillInformation2 = IDL2.Record({
    "proposed_top_up_amount": IDL2.Opt(IDL2.Nat)
  });
  const _ImmutableObjectStorageRefillResult2 = IDL2.Record({
    "success": IDL2.Opt(IDL2.Bool),
    "topped_up_amount": IDL2.Opt(IDL2.Nat)
  });
  const UserRole2 = IDL2.Variant({
    "admin": IDL2.Null,
    "user": IDL2.Null,
    "guest": IDL2.Null
  });
  const UserId2 = IDL2.Principal;
  const Timestamp2 = IDL2.Int;
  const UsageLimitsView2 = IDL2.Record({
    "scansToday": IDL2.Int,
    "userId": UserId2,
    "canScan": IDL2.Bool,
    "dailyLimit": IDL2.Int,
    "lastResetDate": Timestamp2
  });
  const CreateFolderArgs2 = IDL2.Record({ "icon": IDL2.Text, "name": IDL2.Text });
  const FolderId2 = IDL2.Text;
  const FolderView2 = IDL2.Record({
    "id": FolderId2,
    "userId": UserId2,
    "icon": IDL2.Text,
    "name": IDL2.Text,
    "createdAt": Timestamp2
  });
  const UpsertSubscriptionArgs2 = IDL2.Record({
    "stripeSubscriptionId": IDL2.Opt(IDL2.Text),
    "plan": IDL2.Text,
    "currentPeriodEnd": IDL2.Opt(Timestamp2)
  });
  const SubscriptionId2 = IDL2.Text;
  const SubscriptionView2 = IDL2.Record({
    "id": SubscriptionId2,
    "stripeSubscriptionId": IDL2.Opt(IDL2.Text),
    "userId": UserId2,
    "plan": IDL2.Text,
    "currentPeriodEnd": IDL2.Opt(Timestamp2)
  });
  const ScanType2 = IDL2.Variant({
    "receipt": IDL2.Null,
    "other": IDL2.Null,
    "card": IDL2.Null,
    "document": IDL2.Null
  });
  const ExternalBlob2 = IDL2.Vec(IDL2.Nat8);
  const CreateScanArgs2 = IDL2.Record({
    "scanType": ScanType2,
    "tags": IDL2.Vec(IDL2.Text),
    "extractedText": IDL2.Text,
    "confidenceScore": IDL2.Float64,
    "language": IDL2.Text,
    "image": ExternalBlob2,
    "folderId": IDL2.Opt(FolderId2)
  });
  const ScanId2 = IDL2.Text;
  const ScanView2 = IDL2.Record({
    "id": ScanId2,
    "isDeleted": IDL2.Bool,
    "scanType": ScanType2,
    "userId": UserId2,
    "createdAt": Timestamp2,
    "tags": IDL2.Vec(IDL2.Text),
    "isFavorite": IDL2.Bool,
    "extractedText": IDL2.Text,
    "confidenceScore": IDL2.Float64,
    "language": IDL2.Text,
    "updatedAt": Timestamp2,
    "image": ExternalBlob2,
    "exportCount": IDL2.Int,
    "folderId": IDL2.Opt(FolderId2),
    "isPinned": IDL2.Bool
  });
  const UserPlan2 = IDL2.Variant({ "premium": IDL2.Null, "free": IDL2.Null });
  const UserView2 = IDL2.Record({
    "id": UserId2,
    "scansToday": IDL2.Int,
    "createdAt": Timestamp2,
    "plan": UserPlan2,
    "language": IDL2.Text,
    "totalScans": IDL2.Int,
    "updatedAt": Timestamp2
  });
  const ListScansArgs2 = IDL2.Record({
    "includeDeleted": IDL2.Bool,
    "offset": IDL2.Nat,
    "limit": IDL2.Nat,
    "folderId": IDL2.Opt(FolderId2)
  });
  const ListScansResult2 = IDL2.Record({
    "total": IDL2.Nat,
    "scans": IDL2.Vec(ScanView2)
  });
  const UpdateScanArgs2 = IDL2.Record({
    "id": ScanId2,
    "tags": IDL2.Opt(IDL2.Vec(IDL2.Text)),
    "isFavorite": IDL2.Opt(IDL2.Bool),
    "extractedText": IDL2.Opt(IDL2.Text),
    "confidenceScore": IDL2.Opt(IDL2.Float64),
    "language": IDL2.Opt(IDL2.Text),
    "exportCount": IDL2.Opt(IDL2.Int),
    "folderId": IDL2.Opt(FolderId2),
    "isPinned": IDL2.Opt(IDL2.Bool)
  });
  const UpdateUserArgs2 = IDL2.Record({
    "plan": IDL2.Opt(UserPlan2),
    "language": IDL2.Opt(IDL2.Text)
  });
  return IDL2.Service({
    "_immutableObjectStorageBlobsAreLive": IDL2.Func(
      [IDL2.Vec(IDL2.Vec(IDL2.Nat8))],
      [IDL2.Vec(IDL2.Bool)],
      ["query"]
    ),
    "_immutableObjectStorageBlobsToDelete": IDL2.Func(
      [],
      [IDL2.Vec(IDL2.Vec(IDL2.Nat8))],
      ["query"]
    ),
    "_immutableObjectStorageConfirmBlobDeletion": IDL2.Func(
      [IDL2.Vec(IDL2.Vec(IDL2.Nat8))],
      [],
      []
    ),
    "_immutableObjectStorageCreateCertificate": IDL2.Func(
      [IDL2.Text],
      [_ImmutableObjectStorageCreateCertificateResult2],
      []
    ),
    "_immutableObjectStorageRefillCashier": IDL2.Func(
      [IDL2.Opt(_ImmutableObjectStorageRefillInformation2)],
      [_ImmutableObjectStorageRefillResult2],
      []
    ),
    "_immutableObjectStorageUpdateGatewayPrincipals": IDL2.Func([], [], []),
    "_initializeAccessControl": IDL2.Func([], [], []),
    "assignCallerUserRole": IDL2.Func([IDL2.Principal, UserRole2], [], []),
    "checkUsageLimit": IDL2.Func([], [UsageLimitsView2], []),
    "createFolder": IDL2.Func([CreateFolderArgs2], [FolderView2], []),
    "createOrUpdateSubscription": IDL2.Func(
      [UpsertSubscriptionArgs2],
      [SubscriptionView2],
      []
    ),
    "createScan": IDL2.Func([CreateScanArgs2], [ScanView2], []),
    "deleteAccount": IDL2.Func([], [], []),
    "deleteFolder": IDL2.Func([FolderId2], [], []),
    "deleteScan": IDL2.Func([ScanId2], [], []),
    "getCallerUserRole": IDL2.Func([], [UserRole2], ["query"]),
    "getOrCreateUser": IDL2.Func([], [UserView2], []),
    "getScan": IDL2.Func([ScanId2], [IDL2.Opt(ScanView2)], ["query"]),
    "getSubscription": IDL2.Func([], [IDL2.Opt(SubscriptionView2)], ["query"]),
    "incrementScanCount": IDL2.Func([], [], []),
    "isCallerAdmin": IDL2.Func([], [IDL2.Bool], ["query"]),
    "listFolders": IDL2.Func([], [IDL2.Vec(FolderView2)], ["query"]),
    "listScans": IDL2.Func([ListScansArgs2], [ListScansResult2], ["query"]),
    "resetDailyLimits": IDL2.Func([], [], []),
    "restoreScan": IDL2.Func([ScanId2], [], []),
    "searchScans": IDL2.Func([IDL2.Text], [IDL2.Vec(ScanView2)], ["query"]),
    "updateScan": IDL2.Func([UpdateScanArgs2], [ScanView2], []),
    "updateUser": IDL2.Func([UpdateUserArgs2], [UserView2], [])
  });
};
function candid_some(value) {
  return [
    value
  ];
}
function candid_none() {
  return [];
}
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
class ExternalBlob {
  constructor(directURL, blob) {
    __publicField(this, "_blob");
    __publicField(this, "directURL");
    __publicField(this, "onProgress");
    if (blob) {
      this._blob = blob;
    }
    this.directURL = directURL;
  }
  static fromURL(url) {
    return new ExternalBlob(url, null);
  }
  static fromBytes(blob) {
    const url = URL.createObjectURL(new Blob([
      new Uint8Array(blob)
    ], {
      type: "application/octet-stream"
    }));
    return new ExternalBlob(url, blob);
  }
  async getBytes() {
    if (this._blob) {
      return this._blob;
    }
    const response = await fetch(this.directURL);
    const blob = await response.blob();
    this._blob = new Uint8Array(await blob.arrayBuffer());
    return this._blob;
  }
  getDirectURL() {
    return this.directURL;
  }
  withUploadProgress(onProgress) {
    this.onProgress = onProgress;
    return this;
  }
}
var ScanType = /* @__PURE__ */ ((ScanType2) => {
  ScanType2["receipt"] = "receipt";
  ScanType2["other"] = "other";
  ScanType2["card"] = "card";
  ScanType2["document_"] = "document";
  return ScanType2;
})(ScanType || {});
var UserPlan = /* @__PURE__ */ ((UserPlan2) => {
  UserPlan2["premium"] = "premium";
  UserPlan2["free"] = "free";
  return UserPlan2;
})(UserPlan || {});
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async _immutableObjectStorageBlobsAreLive(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageBlobsAreLive(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageBlobsAreLive(arg0);
      return result;
    }
  }
  async _immutableObjectStorageBlobsToDelete() {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageBlobsToDelete();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageBlobsToDelete();
      return result;
    }
  }
  async _immutableObjectStorageConfirmBlobDeletion(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageConfirmBlobDeletion(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageConfirmBlobDeletion(arg0);
      return result;
    }
  }
  async _immutableObjectStorageCreateCertificate(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageCreateCertificate(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageCreateCertificate(arg0);
      return result;
    }
  }
  async _immutableObjectStorageRefillCashier(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageRefillCashier(to_candid_opt_n1(this._uploadFile, this._downloadFile, arg0));
        return from_candid__ImmutableObjectStorageRefillResult_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageRefillCashier(to_candid_opt_n1(this._uploadFile, this._downloadFile, arg0));
      return from_candid__ImmutableObjectStorageRefillResult_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async _immutableObjectStorageUpdateGatewayPrincipals() {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageUpdateGatewayPrincipals();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageUpdateGatewayPrincipals();
      return result;
    }
  }
  async _initializeAccessControl() {
    if (this.processError) {
      try {
        const result = await this.actor._initializeAccessControl();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._initializeAccessControl();
      return result;
    }
  }
  async assignCallerUserRole(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n8(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n8(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async checkUsageLimit() {
    if (this.processError) {
      try {
        const result = await this.actor.checkUsageLimit();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.checkUsageLimit();
      return result;
    }
  }
  async createFolder(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createFolder(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createFolder(arg0);
      return result;
    }
  }
  async createOrUpdateSubscription(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createOrUpdateSubscription(to_candid_UpsertSubscriptionArgs_n10(this._uploadFile, this._downloadFile, arg0));
        return from_candid_SubscriptionView_n12(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createOrUpdateSubscription(to_candid_UpsertSubscriptionArgs_n10(this._uploadFile, this._downloadFile, arg0));
      return from_candid_SubscriptionView_n12(this._uploadFile, this._downloadFile, result);
    }
  }
  async createScan(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createScan(await to_candid_CreateScanArgs_n16(this._uploadFile, this._downloadFile, arg0));
        return from_candid_ScanView_n21(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createScan(await to_candid_CreateScanArgs_n16(this._uploadFile, this._downloadFile, arg0));
      return from_candid_ScanView_n21(this._uploadFile, this._downloadFile, result);
    }
  }
  async deleteAccount() {
    if (this.processError) {
      try {
        const result = await this.actor.deleteAccount();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteAccount();
      return result;
    }
  }
  async deleteFolder(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteFolder(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteFolder(arg0);
      return result;
    }
  }
  async deleteScan(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteScan(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteScan(arg0);
      return result;
    }
  }
  async getCallerUserRole() {
    if (this.processError) {
      try {
        const result = await this.actor.getCallerUserRole();
        return from_candid_UserRole_n27(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCallerUserRole();
      return from_candid_UserRole_n27(this._uploadFile, this._downloadFile, result);
    }
  }
  async getOrCreateUser() {
    if (this.processError) {
      try {
        const result = await this.actor.getOrCreateUser();
        return from_candid_UserView_n29(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getOrCreateUser();
      return from_candid_UserView_n29(this._uploadFile, this._downloadFile, result);
    }
  }
  async getScan(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getScan(arg0);
        return from_candid_opt_n33(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getScan(arg0);
      return from_candid_opt_n33(this._uploadFile, this._downloadFile, result);
    }
  }
  async getSubscription() {
    if (this.processError) {
      try {
        const result = await this.actor.getSubscription();
        return from_candid_opt_n34(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getSubscription();
      return from_candid_opt_n34(this._uploadFile, this._downloadFile, result);
    }
  }
  async incrementScanCount() {
    if (this.processError) {
      try {
        const result = await this.actor.incrementScanCount();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.incrementScanCount();
      return result;
    }
  }
  async isCallerAdmin() {
    if (this.processError) {
      try {
        const result = await this.actor.isCallerAdmin();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.isCallerAdmin();
      return result;
    }
  }
  async listFolders() {
    if (this.processError) {
      try {
        const result = await this.actor.listFolders();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listFolders();
      return result;
    }
  }
  async listScans(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.listScans(to_candid_ListScansArgs_n35(this._uploadFile, this._downloadFile, arg0));
        return from_candid_ListScansResult_n37(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listScans(to_candid_ListScansArgs_n35(this._uploadFile, this._downloadFile, arg0));
      return from_candid_ListScansResult_n37(this._uploadFile, this._downloadFile, result);
    }
  }
  async resetDailyLimits() {
    if (this.processError) {
      try {
        const result = await this.actor.resetDailyLimits();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.resetDailyLimits();
      return result;
    }
  }
  async restoreScan(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.restoreScan(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.restoreScan(arg0);
      return result;
    }
  }
  async searchScans(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.searchScans(arg0);
        return from_candid_vec_n39(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.searchScans(arg0);
      return from_candid_vec_n39(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateScan(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateScan(to_candid_UpdateScanArgs_n40(this._uploadFile, this._downloadFile, arg0));
        return from_candid_ScanView_n21(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateScan(to_candid_UpdateScanArgs_n40(this._uploadFile, this._downloadFile, arg0));
      return from_candid_ScanView_n21(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateUser(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateUser(to_candid_UpdateUserArgs_n42(this._uploadFile, this._downloadFile, arg0));
        return from_candid_UserView_n29(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateUser(to_candid_UpdateUserArgs_n42(this._uploadFile, this._downloadFile, arg0));
      return from_candid_UserView_n29(this._uploadFile, this._downloadFile, result);
    }
  }
}
async function from_candid_ExternalBlob_n25(_uploadFile, _downloadFile, value) {
  return await _downloadFile(value);
}
async function from_candid_ListScansResult_n37(_uploadFile, _downloadFile, value) {
  return await from_candid_record_n38(_uploadFile, _downloadFile, value);
}
function from_candid_ScanType_n23(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n24(_uploadFile, _downloadFile, value);
}
async function from_candid_ScanView_n21(_uploadFile, _downloadFile, value) {
  return await from_candid_record_n22(_uploadFile, _downloadFile, value);
}
function from_candid_SubscriptionView_n12(_uploadFile, _downloadFile, value) {
  return from_candid_record_n13(_uploadFile, _downloadFile, value);
}
function from_candid_UserPlan_n31(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n32(_uploadFile, _downloadFile, value);
}
function from_candid_UserRole_n27(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n28(_uploadFile, _downloadFile, value);
}
function from_candid_UserView_n29(_uploadFile, _downloadFile, value) {
  return from_candid_record_n30(_uploadFile, _downloadFile, value);
}
function from_candid__ImmutableObjectStorageRefillResult_n4(_uploadFile, _downloadFile, value) {
  return from_candid_record_n5(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n14(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n15(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n26(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
async function from_candid_opt_n33(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : await from_candid_ScanView_n21(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n34(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_SubscriptionView_n12(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n6(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n7(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_record_n13(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    stripeSubscriptionId: record_opt_to_undefined(from_candid_opt_n14(_uploadFile, _downloadFile, value.stripeSubscriptionId)),
    userId: value.userId,
    plan: value.plan,
    currentPeriodEnd: record_opt_to_undefined(from_candid_opt_n15(_uploadFile, _downloadFile, value.currentPeriodEnd))
  };
}
async function from_candid_record_n22(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    isDeleted: value.isDeleted,
    scanType: from_candid_ScanType_n23(_uploadFile, _downloadFile, value.scanType),
    userId: value.userId,
    createdAt: value.createdAt,
    tags: value.tags,
    isFavorite: value.isFavorite,
    extractedText: value.extractedText,
    confidenceScore: value.confidenceScore,
    language: value.language,
    updatedAt: value.updatedAt,
    image: await from_candid_ExternalBlob_n25(_uploadFile, _downloadFile, value.image),
    exportCount: value.exportCount,
    folderId: record_opt_to_undefined(from_candid_opt_n26(_uploadFile, _downloadFile, value.folderId)),
    isPinned: value.isPinned
  };
}
function from_candid_record_n30(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    scansToday: value.scansToday,
    createdAt: value.createdAt,
    plan: from_candid_UserPlan_n31(_uploadFile, _downloadFile, value.plan),
    language: value.language,
    totalScans: value.totalScans,
    updatedAt: value.updatedAt
  };
}
async function from_candid_record_n38(_uploadFile, _downloadFile, value) {
  return {
    total: value.total,
    scans: await from_candid_vec_n39(_uploadFile, _downloadFile, value.scans)
  };
}
function from_candid_record_n5(_uploadFile, _downloadFile, value) {
  return {
    success: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.success)),
    topped_up_amount: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.topped_up_amount))
  };
}
function from_candid_variant_n24(_uploadFile, _downloadFile, value) {
  return "receipt" in value ? "receipt" : "other" in value ? "other" : "card" in value ? "card" : "document" in value ? ScanType.document : value;
}
function from_candid_variant_n28(_uploadFile, _downloadFile, value) {
  return "admin" in value ? "admin" : "user" in value ? "user" : "guest" in value ? "guest" : value;
}
function from_candid_variant_n32(_uploadFile, _downloadFile, value) {
  return "premium" in value ? "premium" : "free" in value ? "free" : value;
}
async function from_candid_vec_n39(_uploadFile, _downloadFile, value) {
  return await Promise.all(value.map(async (x) => await from_candid_ScanView_n21(_uploadFile, _downloadFile, x)));
}
async function to_candid_CreateScanArgs_n16(_uploadFile, _downloadFile, value) {
  return await to_candid_record_n17(_uploadFile, _downloadFile, value);
}
async function to_candid_ExternalBlob_n20(_uploadFile, _downloadFile, value) {
  return await _uploadFile(value);
}
function to_candid_ListScansArgs_n35(_uploadFile, _downloadFile, value) {
  return to_candid_record_n36(_uploadFile, _downloadFile, value);
}
function to_candid_ScanType_n18(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n19(_uploadFile, _downloadFile, value);
}
function to_candid_UpdateScanArgs_n40(_uploadFile, _downloadFile, value) {
  return to_candid_record_n41(_uploadFile, _downloadFile, value);
}
function to_candid_UpdateUserArgs_n42(_uploadFile, _downloadFile, value) {
  return to_candid_record_n43(_uploadFile, _downloadFile, value);
}
function to_candid_UpsertSubscriptionArgs_n10(_uploadFile, _downloadFile, value) {
  return to_candid_record_n11(_uploadFile, _downloadFile, value);
}
function to_candid_UserPlan_n44(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n45(_uploadFile, _downloadFile, value);
}
function to_candid_UserRole_n8(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n9(_uploadFile, _downloadFile, value);
}
function to_candid__ImmutableObjectStorageRefillInformation_n2(_uploadFile, _downloadFile, value) {
  return to_candid_record_n3(_uploadFile, _downloadFile, value);
}
function to_candid_opt_n1(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(to_candid__ImmutableObjectStorageRefillInformation_n2(_uploadFile, _downloadFile, value));
}
function to_candid_record_n11(_uploadFile, _downloadFile, value) {
  return {
    stripeSubscriptionId: value.stripeSubscriptionId ? candid_some(value.stripeSubscriptionId) : candid_none(),
    plan: value.plan,
    currentPeriodEnd: value.currentPeriodEnd ? candid_some(value.currentPeriodEnd) : candid_none()
  };
}
async function to_candid_record_n17(_uploadFile, _downloadFile, value) {
  return {
    scanType: to_candid_ScanType_n18(_uploadFile, _downloadFile, value.scanType),
    tags: value.tags,
    extractedText: value.extractedText,
    confidenceScore: value.confidenceScore,
    language: value.language,
    image: await to_candid_ExternalBlob_n20(_uploadFile, _downloadFile, value.image),
    folderId: value.folderId ? candid_some(value.folderId) : candid_none()
  };
}
function to_candid_record_n3(_uploadFile, _downloadFile, value) {
  return {
    proposed_top_up_amount: value.proposed_top_up_amount ? candid_some(value.proposed_top_up_amount) : candid_none()
  };
}
function to_candid_record_n36(_uploadFile, _downloadFile, value) {
  return {
    includeDeleted: value.includeDeleted,
    offset: value.offset,
    limit: value.limit,
    folderId: value.folderId ? candid_some(value.folderId) : candid_none()
  };
}
function to_candid_record_n41(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    tags: value.tags ? candid_some(value.tags) : candid_none(),
    isFavorite: value.isFavorite ? candid_some(value.isFavorite) : candid_none(),
    extractedText: value.extractedText ? candid_some(value.extractedText) : candid_none(),
    confidenceScore: value.confidenceScore ? candid_some(value.confidenceScore) : candid_none(),
    language: value.language ? candid_some(value.language) : candid_none(),
    exportCount: value.exportCount ? candid_some(value.exportCount) : candid_none(),
    folderId: value.folderId ? candid_some(value.folderId) : candid_none(),
    isPinned: value.isPinned ? candid_some(value.isPinned) : candid_none()
  };
}
function to_candid_record_n43(_uploadFile, _downloadFile, value) {
  return {
    plan: value.plan ? candid_some(to_candid_UserPlan_n44(_uploadFile, _downloadFile, value.plan)) : candid_none(),
    language: value.language ? candid_some(value.language) : candid_none()
  };
}
function to_candid_variant_n19(_uploadFile, _downloadFile, value) {
  return value == "receipt" ? {
    receipt: null
  } : value == "other" ? {
    other: null
  } : value == "card" ? {
    card: null
  } : value == ScanType.document ? {
    document_: null
  } : value;
}
function to_candid_variant_n45(_uploadFile, _downloadFile, value) {
  return value == "premium" ? {
    premium: null
  } : value == "free" ? {
    free: null
  } : value;
}
function to_candid_variant_n9(_uploadFile, _downloadFile, value) {
  return value == "admin" ? {
    admin: null
  } : value == "user" ? {
    user: null
  } : value == "guest" ? {
    guest: null
  } : value;
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
export {
  Backend,
  ExternalBlob,
  ScanType,
  UserPlan,
  createActor
};
