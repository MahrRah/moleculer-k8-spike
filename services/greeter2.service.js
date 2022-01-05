"use strict";

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
				console.log("heree2");
				// throw "fuuu";
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
				
				return `Welcome2, ${ctx.params}`;
			}
		}
	}

};
