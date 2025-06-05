"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var event_item_svc_exports = {};
__export(event_item_svc_exports, {
  default: () => event_item_svc_default
});
module.exports = __toCommonJS(event_item_svc_exports);
var import_mongoose = require("mongoose");
const EventItemScheme = new import_mongoose.Schema(
  {
    eventId: { type: String, required: true, trim: true },
    creator: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    rsvps: [{ type: import_mongoose.Types.ObjectId, ref: "Credential", default: [] }]
  },
  { collection: "events" }
);
const EventItemModel = (0, import_mongoose.model)(
  "Event",
  EventItemScheme
);
function index() {
  return EventItemModel.find().populate("rsvps", "username").exec().then((docs) => {
    return docs.map((doc) => {
      const o = doc.toObject();
      o.rsvps = o.rsvps.map((user) => ({
        _id: user._id.toString(),
        username: user.username
      }));
      return o;
    });
  });
}
function get(eventId) {
  return EventItemModel.findOne({ eventId }).populate("rsvps", "username").exec().then((doc) => {
    if (!doc) throw `${eventId} Not Found`;
    const result = doc.toObject();
    result.rsvps = result.rsvps.map((user) => ({
      _id: user._id.toString(),
      username: user.username
    }));
    return result;
  });
}
function create(json) {
  const t = new EventItemModel(json);
  return t.save();
}
function update(eventId, eventItem) {
  return EventItemModel.findOneAndUpdate({ userid: eventId }, eventItem, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${eventId} not updated`;
    else return updated;
  });
}
function remove(eventId) {
  return EventItemModel.findOneAndDelete({ eventId }).then(
    (deleted) => {
      if (!deleted) throw `${eventId} not deleted`;
    }
  );
}
function findByCreator(creatorId) {
  let objId;
  try {
    objId = new import_mongoose.Types.ObjectId(creatorId);
  } catch {
    return Promise.resolve([]);
  }
  return EventItemModel.find({ creator: objId }).exec();
}
function addRsvp(eventId, userId) {
  let objUserId;
  try {
    objUserId = new import_mongoose.Types.ObjectId(userId);
  } catch {
    return Promise.reject(new Error("Invalid userId"));
  }
  return EventItemModel.findOneAndUpdate(
    { eventId },
    { $addToSet: { rsvps: objUserId } },
    // push only if not already in the array
    { new: true }
  ).exec().then((updated) => {
    if (!updated) throw new Error(`Event ${eventId} not found`);
    return updated;
  });
}
function removeRsvp(eventId, userId) {
  let objUserId;
  try {
    objUserId = new import_mongoose.Types.ObjectId(userId);
  } catch {
    return Promise.reject(new Error("Invalid userId"));
  }
  return EventItemModel.findOneAndUpdate(
    { eventId },
    { $pull: { rsvps: objUserId } },
    { new: true }
  ).exec().then((updated) => {
    if (!updated) throw new Error(`Event ${eventId} not found`);
    return updated;
  });
}
var event_item_svc_default = {
  index,
  get,
  create,
  update,
  remove,
  findByCreator,
  addRsvp,
  removeRsvp
};
