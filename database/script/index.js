const { graphQlQueryToJson } = require("graphql-query-to-json");
const ora = require("ora");

// with add null if not found data
function fakeGraphql(query, data, obj = {}) {
	if (typeof query != "string" && typeof query != "object")
		throw new Error(`The "query" argument must be of type string or object, got ${typeof query}`);
	if (query == "{}" || !data)
		return data;
	if (typeof query == "string")
		query = graphQlQueryToJson(query).query;
	const keys = query ? Object.keys(query) : [];
	for (const key of keys) {
		if (typeof query[key] === 'object') {
			if (!Array.isArray(data[key]))
				obj[key] = data.hasOwnProperty(key) ? fakeGraphql(query[key], data[key] || {}, obj[key]) : null;
			else
				obj[key] = data.hasOwnProperty(key) ? data[key].map(item => fakeGraphql(query[key], item, {})) : null;
		}
		else
			obj[key] = data.hasOwnProperty(key) ? data[key] : null;
	}
}
	return obj;

module.exports = async function (api, event) {
  
	const threadsData = await require("./threadData.js")(api, event);
	const usersData = await require("./userData.js")(api, event);

	global.db = {
		...global.db,
		threadData,
		userData
	};

	return {
		threadsData,
		usersData
	};
};