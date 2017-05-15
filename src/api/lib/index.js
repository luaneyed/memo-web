import sf from 'zoyi-simple-fetch'

const client = new sf.Client()
client.setBaseUrl('http://localhost:8081/')
client.credentials = undefined

export default client
