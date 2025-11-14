dotnet build -o publish
dotnet publish
scp -r ./publish/* monitor@192.168.68.144:/var/www/monitor

#scp -r ./bin/Debug/net8.0 monitor@192.168.68.144:/var/www/monitor
#rsync -avz --update ./bin/Debug/net8.0/ monitor@192.168.68.144:/var/www/monitor
#rsync -avz --update ./bin/Release/net8.0/publish monitor@192.168.68.144:/var/www/monitor
#dotnet publish -c Release
#
#scp -r ./bin/Release/net8.0 monitor@192.168.68.144:/var/www/monitor
#sudo find /var/www/monitor -type d -exec chmod 755 {} \;
#sudo find /var/www/monitor -type f -exec chmod 644 {} \;
#ssh monitor@192.168.68.144 "sudo find /var/www/monitor -type d -exec chmod 755 {} \;"

# sudo systemctl restart kestrel-monitor
