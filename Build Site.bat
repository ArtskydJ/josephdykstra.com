@echo off

pushd C:\Users\Joseph\Github\josephdykstra.com\generator

node index && ^
cp ../docs/resume.pdf ../content/resume.pdf && ^
start http://localhost/josephdykstra.com/docs/ && ^
popd && ^
sleep 5
