"use strict";
const { MoleculerError } = require("moleculer").Errors;
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "greeter2",
	/**
	 * Actions
	 */
	actions: {

		/**
		 * Say a 'Hello' action.
		 *
		 * @returns
		 */
		hellotwo: {
			rest: {
				method: "GET",
				path: "/hello2"
			},
			async handler() {
				return "Hello Moleculer2";
			}
		},

		/**
		 * Welcome, a username
		 *
		 * @param {String} name - User name
		 */
		welcometwo: {
			rest: "/welcome2",
			params: {
				name: "string"
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				throw new MoleculerError("Wups! Something happened", 501, "ERR_SOMETHING", { requestID: ctx.requestID, nodeID:ctx.nodeID}); 

			}
		}
	}

};
