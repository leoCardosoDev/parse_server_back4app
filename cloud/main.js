const Professional = Parse.Object.extend("Professional")
Parse.Cloud.define("v1-get-professionals", async (request) => {
	const query = new Parse.Query(Professional)
  query.equalTo("crm", "123")
  query.include(['specialties', 'services'])
  const results = await query.find({useMasterKey: true})
  return results
})
