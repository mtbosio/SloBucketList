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
    imgSrc: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true }
  },
  { collection: "events" }
);
const EventItemModel = (0, import_mongoose.model)(
  "Event",
  EventItemScheme
);
function index() {
  return EventItemModel.find();
}
function get(eventId) {
  return EventItemModel.find({ eventId }).then((list) => list[0]).catch(() => {
    throw `${eventId} Not Found`;
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
var event_item_svc_default = { index, get, create, update, remove };
