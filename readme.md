# Socket and API Exercise

Simple Node/Server-side Socket.io client that saves data to redis and passes transmitted data along to a HapiJS based API. The API runs the data through some functions to normalize some fields and emits the updated data to connected sockets.

The API also offers a get method that will retrieve the data (based on a supplied ID) 

## Uses Redis as a simple data store:

* Start redis with `redis-server`
* use `redis-cli` to verify records
