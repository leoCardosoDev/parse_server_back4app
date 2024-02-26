const Professional = Parse.Object.extend("Professional")
const Specialty = Parse.Object.extend("Specialty")

Parse.Cloud.define('v1-sign-in', async (req) => {
  const user = await Parse.User.logIn(req.params.email.toLowerCase(), req.params.password)
  return formatUser(user.toJSON())
}, {
  fields: {
    email: { required: true },
    password: { required: true },
  }
})


Parse.Cloud.define("v1-get-professionals", async (req) => {
	const query = new Parse.Query(Professional)
  query.include(['specialties', 'insurances', 'services'])

  if (req.params.specialtyId) {
    const specialty = new Specialty()
    specialty.id = req.params.specialtyId
    query.equalTo('specialties', specialty)
  }

  if (req.params.lat && req.params.long) {
    const point = new Parse.GeoPoint({latitude: req.params.lat, longitude: req.params.long})
    query.withinlilometers('location', point, req.params.maxDistance || 50)
  }

  if (req.params.limit && req.params.skip) {
    query.limit(req.params.limit)
    query.skip(req.params.skip)
  }

  const results = await query.find({useMasterKey: true})
  return results.map((r) => formatProfissional(r.toJson()))
}, {
  fields: {}
})

function formatSpecialty (s) {
  return {
    id: s.objectId,
    name: s.name
  }
}

function formatProfissional(p) {
  return {
    id: p.objectId,
    name: p.name,
    specialies: p.specialies.map((s) => formatSpecialty(s))
  }
}

function formatUser (u) {
  return {
    id: u.objectId,
    token: u.sessionToken,
    fullname: u.fullname,
    document: u.document,
    phone: u.phone
  }
}
