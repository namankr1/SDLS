#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <errno.h>
 
#include <modbus.h>
 
int main (void) {
    modbus_t *ctx;
    uint16_t tab_reg[64];
    int rc;
    int i;
 
    ctx = modbus_new_rtu("/dev/ttyUSB0", 19200, 'E', 8, 1);
    if (ctx == NULL ) {
        fprintf(stderr, "Connection failed: %s\n", modbus_strerror(errno));
        modbus_free(ctx);
        return -1;
    } else {
      fprintf(stderr, "Connected to /dev/ttyUSB0\n");
    }
 
    modbus_set_debug(ctx, 0x01);
 
    rc = modbus_set_slave(ctx, 0x01);
    if (rc == -1) {
      fprintf(stderr, "Set slave error: %s\n", modbus_strerror(errno));
      return -1;
    } else {
      fprintf(stderr, "Slave set to 0x01\n");
    }
 
 
    rc = modbus_read_registers(ctx, 3901, 10, tab_reg);
    
    if (rc == -1) {
        fprintf(stderr, "%s\n", modbus_strerror(errno));
        return -1;
    } else {
      fprintf(stderr, "Called Modbus function code 0x03 (read holding registers) = %d\n", rc);
    }
    for (i=0; i < rc; i++) {
        printf("reg[%d]=%d (0x%X)\n", i, tab_reg[i], tab_reg[i]);
    }
 
    modbus_close(ctx);
    modbus_free(ctx);
 
    return 0;
}
