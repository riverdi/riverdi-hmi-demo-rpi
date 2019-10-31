const si = require('systeminformation');
const allthingstalk = require('allthingstalk');

var sensor = require('ds18x20')

var listOfDeviceIds = sensor.list();
console.log(listOfDeviceIds);

allthingstalk.credentials = {
	"deviceId": "",
	"token": "maker:"
};

allthingstalk.connect();

function compareByMem(a,b) {

	if (a.pmem < b.pmem)
		return 1;
 
	if ( a.pmem > b.pmem )
		return -1;

	return 0;
}

setInterval(function() {

	si.currentLoad(function(data) {
		allthingstalk.send (Number ((data.currentload_system).toFixed(1)), 'cpu_load_cur');
	})

	si.cpuTemperature(function(data) {
		allthingstalk.send (Number ((data.main).toFixed(1)), 'cpu_temp_main');
	})

	si.mem(function(data) {
		allthingstalk.send (Number ((data.free/1024/1024).toFixed(0)), 'mem_info_free');
		allthingstalk.send (Number ((data.swapfree/1024/1024).toFixed(0)), 'mem_swap_free');
	})

	si.processes(function(data) {

		data.list.sort(compareByMem)
		allthingstalk.send (data.list[0].name + " " + data.list[0].params + "|" + data.list[0].pid + "|" + data.list[0].pmem, 'top_proc_1');
		allthingstalk.send (data.list[1].name + " " + data.list[1].params + "|" + data.list[1].pid + "|" + data.list[1].pmem, 'top_proc_2');
		allthingstalk.send (data.list[2].name + " " + data.list[2].params + "|" + data.list[2].pid + "|" + data.list[2].pmem, 'top_proc_3');
		allthingstalk.send (data.list[3].name + " " + data.list[3].params + "|" + data.list[3].pid + "|" + data.list[3].pmem, 'top_proc_4');
	})

	sensor.get('28-000008be58b7', function (err, temp) {
		allthingstalk.send (temp, 'temp_1');
	});

	sensor.get('28-000008bedfea', function (err, temp) {
		allthingstalk.send (temp, 'temp_2');
	});

	sensor.get('28-000008bedfe2', function (err, temp) {
		allthingstalk.send (temp, 'temp_3');
	});

	sensor.get('28-000008bedfe3', function (err, temp) {
		allthingstalk.send (temp, 'temp_4');
	});
}, 4000)
