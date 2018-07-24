/*
 * Copyright © 2008-2014 Stéphane Raimbault <stephane.raimbault@gmail.com>
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>
#include <errno.h>
#include <modbus.h>

#include "unit-test.h"

const int EXCEPTION_RC = 2;

enum {
    TCP,
    TCP_PI,
    RTU
};



#define BUG_REPORT(_cond, _format, _args ...) \
    printf("\nLine %d: assertion error for '%s': " _format "\n", __LINE__, # _cond, ## _args)

#define ASSERT_TRUE(_cond, _format, __args...) {  \
    if (_cond) {                                  \
        printf("OK\n");                           \
    } else {                                      \
        BUG_REPORT(_cond, _format, ## __args);    \
        goto close;                               \
    }                                             \
};


int main(int argc, char *argv[])
{
    const int NB_REPORT_SLAVE_ID = 10;
    uint8_t *tab_rp_bits = NULL;
    uint16_t *tab_rp_registers = NULL;
    uint16_t *tab_rp_registers_bad = NULL;
    modbus_t *ctx = NULL;
    int i;
    uint8_t value;
    int nb_points;
    int rc;
    float real;
    uint32_t old_response_to_sec;
    uint32_t old_response_to_usec;
    uint32_t new_response_to_sec;
    uint32_t new_response_to_usec;
    uint32_t old_byte_to_sec;
    uint32_t old_byte_to_usec;
    int use_backend;
    int success = FALSE;
    int old_slave;

   
    use_backend = RTU;
    ctx = modbus_new_rtu("/dev/ttyUSB0", 19200, 'E', 8, 1);
    
    
    
    if (ctx == NULL) {
        fprintf(stderr, "Unable to allocate libmodbus context\n");
        return -1;
    }
    
     

    if (use_backend == RTU) {
        modbus_set_slave(ctx, 10);
    }
    
    

    if (modbus_connect(ctx) == -1) {
        fprintf(stderr, "Connection failed: %s\n", modbus_strerror(errno));
        modbus_free(ctx);
        return -1;
    }
    
    

	  




    /* Allocate and initialize the memory to store the registers */

        
    nb_points = 100;
    
    tab_rp_registers = (uint16_t *) malloc(nb_points * sizeof(uint16_t));
    memset(tab_rp_registers, 0, nb_points * sizeof(uint16_t));
    

    printf("\nTEST READ:\n");


    

    /** HOLDING REGISTERS **/

  

    /* Many registers */
    
    int k=0;
	for(k=0;k<10;k++){
	
	rc = modbus_read_registers(ctx, 0,
                               10, tab_rp_registers);
          
    if(rc == -1){
    
    	printf("Error in rc\n");
    }                     
    printf("modbus_read_registers: \n");
    
    for(i=0;i<rc;i++)
    	printf("degrees %d\n", tab_rp_registers[i]);
	
	
	}  


    
    	
close:
    /* Free the memory */
    free(tab_rp_bits);
    free(tab_rp_registers);

    /* Close the connection */
    modbus_close(ctx);
    modbus_free(ctx);


    return 0;
}
