rs.initiate({
_id: "replica01",
members: [
{ _id: 0, host: "mongo-primary:27017" },
{ _id: 1, host: "mongo-secondary1:27017" },
{ _id: 2, host: "mongo-secondary2:27017" },
{ _id: 3, host: "mongo-secondary3:27017" }
]
})







