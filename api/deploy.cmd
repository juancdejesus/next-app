dotnet build -o publish
dotnet publish
scp -r ./publish/* monitor@192.168.68.144:/var/www/monitor

