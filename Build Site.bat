@echo off

pushd C:\Users\Joseph\Github\josephdykstra.com\generator

node index && ^
start http://localhost/josephdykstra.com/docs/ && ^
popd && ^
sleep 5
