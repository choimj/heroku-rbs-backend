"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "Session",
    embedded: false
  },
  {
    name: "Group",
    embedded: false
  },
  {
    name: "GroupParticipant",
    embedded: false
  },
  {
    name: "Category",
    embedded: false
  },
  {
    name: "CategoryParticipant",
    embedded: false
  },
  {
    name: "Room",
    embedded: false
  },
  {
    name: "Booking",
    embedded: false
  },
  {
    name: "BookingParicipant",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `https://rbs-a7af25ba21.herokuapp.com/heroku-rbs-backend/dev`
});
exports.prisma = new exports.Prisma();
