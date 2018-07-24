#include <chrono>
#include <ctime>
#include <curl/curl.h>
#include <errno.h>
#include <fstream>
#include <iostream>
#include <modbus.h>
#include <cstring>
#include <thread>

using namespace std;

static size_t WriteCallback(void *contents, size_t size, size_t nmemb, void *userp)
{
	((std::string*)userp)->append((char*)contents, size * nmemb);
	return size * nmemb;
}

long modbus_get_long(const uint16_t *src)
{
	long f;
	uint32_t i;
	i = (((uint32_t)src[1]) << 16) + src[0];
	memcpy(&f, &i, sizeof(long));
	return f;
}

int main()
{
	modbus_t *ctx;
	int response_code = 0;
	int rc;
	struct timeval response_timeout;
	response_timeout.tv_sec = 60;
	response_timeout.tv_usec = 0;
	ctx = modbus_new_rtu("/dev/ttyUSB0", 9600, 'E', 8, 1);
	
	if (NULL == ctx)
	{
		cout<<"\tUnable to create libmodbus context"<<endl;
		response_code = 1;
		return 1;
	}
	
	rc = modbus_set_slave(ctx, 1);
	
	if (rc != 0)
	{
		cout<<"\tmodbus_set_slave:"<< modbus_strerror(errno)<<endl;
		response_code = 1;
		modbus_close(ctx);
		modbus_free(ctx);
		return 1;
	}
	
	rc = modbus_connect(ctx);

	if (rc == -1) {
		cout<<"\tConnection failed:"<< modbus_strerror(errno)<<endl;
		response_code = 1;
		modbus_close(ctx);
		modbus_free(ctx);
		return 1;
	}
	
	modbus_flush(ctx);
	
	int max_num_of_address = 57;
	int reg_add[max_num_of_address] = {
			3913, 3929, 3943, 3957, 3909, 3911, 3925, 3939, 3953, 3927, 3941, 3955, 3903, 3919, 3933, 3947, 3905, 3921, 
			3935, 3949, 3901, 3917, 3931, 3945, 3907, 3923, 3937, 3951, 3915, 3861, 3863, 3865, 3867, 3869, 3871, 3959, 
			3961, 3963, 3965, 3967, 3969, 3971, 3973, 3975, 3977, 3979, 3881, 3883, 3885, 3887, 3889, 3891, 3993, 3995, 
			3997, 3999, 3981
					  };


	string label_reg[max_num_of_address] = {
			"A (Current average)", "A1 (Current, phase 1)", "A2 (Current, phase 2)", "A3 (Current, phase 3)",
			"VLL (Line to line average voltage)", "VLN (Line to neutral voltage)", "V12 (Voltage phase 1 to phase 2)",
			"V23 (Voltage phase 2 to phase 3)", "V31 (Voltage phase 3 to phase 1)", "V1 (Voltage phase 1 to neutral)",
			"V2 (Voltage phase 2 to neutral)", "V3 (Voltage phase 3 to neutral)", "W (Active power, total)",
			"W1 (Active power, phase 1)", "W2 (Active power, phase 2)", "W3 (Active power, phase 3)",
			"VAR (Reactive power, total)", "VAR1 (Reactive power, phase 1)", "VAR2 (Reactive power, phase 2)",
			"VAR3 (Reactive power, phase3)", "VA (Apparent power, total)", "VA1 (Apparent power, phase 1)",
			"VA2 (Apparent power, phase 2)", "VA3 (Apparent power,phase 3)", "PF (Power factor average)",
			"PF1 (Power factor, phase 1)", "PF2 (Power factor, phase 2)", "PF3 (Power factor, phase 3)", 
			"F (Frequency, Hz)", "\%V1 (Voltage THD, phase 1)", "\%V2 (Voltage THD, phase 2)",
			"\%V3 (Voltage THD, phase 3)", "\%A1 (Current THD, phase 1)", "\%A2 (Current THD, phase 2)",
			"\%A3 (Current THD, phase 3)", "FwdVAh (Forward apparent energy)","FwdWh (Forward active energy)",
			"FwdVARh (Forward reactive inductive energy)", "FwdVARh (Forward reactive capacitive energy)",
			"RevVAh (Reverse apparent energy)","RevWh (Reverse active energy)", 
			"RevVARh (Reverse reactive inductive Energy)", "RevVARh (Reverse reactive capacitive Energy)",
			"Present Demand", "Rising Demand","Maximum demand", "\% Avg Load", "%L1 (Percentage of phase 1 load)",
			"%L2 (Percentage of phase 2 load)", "%L3 (Percentage of phase 3 load)","Unbalanced \%Load",
			"Unbalanced % voltage","On hrs", "FwdRun secs (Forward run seconds)", "RevRun secs (Reverse run seconds)",
			"Intr (Number of power interruptions)", "Maximum demand occurrence time"
							 };

	float reg_value_float = 0;
	long reg_value_long = 0;
	uint16_t tab_reg[2] = {0,0};
	
	int temp_address_num;
	
	char curr_date[20];
	char curr_date_rev[20];
	char curr_time[20];
	
	struct tm * timeinfo;
	time_t rawtime_begining;
	time_t rawtime_ending;
	
	string json_data;
	string server_response;
	
	CURL *curl;
	ofstream myfile;
	int hour = 4 * 60 ;
	
	while(hour-->0){
		json_data = "";
		server_response = "";
		time (&rawtime_begining);
		timeinfo = localtime(&rawtime_begining);

		strftime(curr_date,sizeof(curr_date),"%d-%m-%Y",timeinfo);
		strftime(curr_date_rev,sizeof(curr_date_rev),"%Y-%m-%d",timeinfo);
		strftime(curr_time,sizeof(curr_time),"%H:%M:%S",timeinfo);

		myfile.open ("/home/pi/substationlogger/data_entries/data_" +(string)curr_date_rev +".txt", ios::out | ios::app);
		myfile << curr_date<<","<<curr_time<<",";

		json_data = "{\"date\":\"" + (string)curr_date +"\",\"key\":\"3debe0a5d6466f42afd958dfd2efa808eeaf3a384ca6d08fd9fb38b8fa3b9a22\",\"time\":\""+ (string)curr_time+"\",\"readings\":{" ;
		
		//cout<<"\t\n\n************* Iteration ****************\n\n";
		
		for( temp_address_num =0; temp_address_num <max_num_of_address; temp_address_num++){
			
			rc = modbus_read_registers(ctx, (reg_add[temp_address_num] -1), 2, tab_reg);
			
			if (rc == -1) {
				cout<<"\tRead registers failed:"<<modbus_strerror(errno)<<endl;
				response_code = 1;
				myfile<<"\n";
				myfile.close();
				modbus_close(ctx);
				modbus_free(ctx);
				return 1;
			}
			
			if(temp_address_num< 52){
				reg_value_float = modbus_get_float(tab_reg);
				json_data += "\"R" + to_string(reg_add[temp_address_num]) + "\":\"" +to_string(reg_value_float) +"\"";
				myfile<<reg_value_float<<",";
				//cout<<"\tRegister "<<reg_add[temp_address_num]<< "( "<<label_reg[temp_address_num]<<") = "<< reg_value_float<<endl;
			}
			else{
				reg_value_long  = modbus_get_long(tab_reg);
				json_data += "\"R" + to_string(reg_add[temp_address_num]) + "\":\"" + to_string(reg_value_long) +"\"";
				myfile<<reg_value_long<<",";
				//cout<<"\tRegister "<<reg_add[temp_address_num]<< "( "<<label_reg[temp_address_num]<<") = "<< reg_value_long<<endl;
			}

			if(temp_address_num < (max_num_of_address -1) ){
				json_data+=",";
			}
		}
		myfile<<"\n";
		myfile.close();
		json_data += "}}" ;
		//cout<<"\t"<<json_data<<endl;
		try{
		
			curl = curl_easy_init();
	
			if(curl) {
				curl_easy_setopt(curl, CURLOPT_URL,"http://www.iitp.ac.in/~cds/sdls/insert.php");
				curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_data.c_str());
				curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
				curl_easy_setopt(curl, CURLOPT_WRITEDATA, &server_response);
				curl_easy_setopt(curl, CURLOPT_TIMEOUT, 50L);
				curl_easy_perform(curl);
				curl_easy_cleanup(curl);
				if(server_response.length() > 100){
					server_response = server_response.substr(0,100);
				}
				cout <<"\t"<< curr_date << " "<<curr_time<<" " <<server_response << endl;
	
			}
			else{
				cout<<"\tError in sending data to server"<<endl;
				modbus_close(ctx);
				modbus_free(ctx);
				return 1;
		}
		}
		catch(...){
			cout<<"\tError in connection"<<endl;
			modbus_close(ctx);
			modbus_free(ctx);
			return 1;
		}
		time (&rawtime_ending);
		this_thread::sleep_for(chrono::seconds((60 - (long)difftime(rawtime_ending, rawtime_begining))));
	}
	modbus_close(ctx);
	modbus_free(ctx);
	return 0;
}
