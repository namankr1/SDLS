#include <stdio.h>
#include <stdlib.h>
#include <modbus.h>
#include <errno.h>
int main()
{
  struct timeval old_response_timeout;
  struct timeval response_timeout;
  modbus_t *ctx = NULL;
  int rc = 0;
  uint16_t tab_reg[64];
  int i = 0;
  int slave = 0;
  int connected = 0;
  int serial = 0;
  ctx = modbus_new_rtu("/dev/ttyS2", 19200, 'E', 8, 1);
  
  
  if (ctx == NULL) {
    fprintf(stderr, "Unable to create the libmodbus context\n");
    return -1;
  }
  modbus_set_debug(ctx, 1);
  modbus_get_response_timeout(ctx, &old_response_timeout);
  response_timeout.tv_sec = 10;
  response_timeout.tv_usec = 0;
  modbus_set_response_timeout(ctx, &response_timeout);
  modbus_set_byte_timeout(ctx, &response_timeout);

  slave = modbus_set_slave(ctx,247);

  if(slave == -1)
    printf("Didn't connect to slave/n");

  connected = modbus_connect(ctx);

  if(connected == -1)
    printf("Connection failed\n");
  if(connected == 0)
    printf("connected\n");
  //serial = modbus_rtu_set_serial_mode(ctx, MODBUS_RTU_RS485);
  //if(serial == -1)
  //  printf("Didn't set serial mode/n:%s\n",modbus_strerror(errno));
  rc = modbus_read_registers(ctx,0x27,2,tab_reg);

  if (rc == -1) {
  fprintf(stderr, "%s\n", modbus_strerror(errno));
  return -1;
  }

  for(i=0;i<rc;i++)
    printf("degrees %d\n", tab_reg[i]);
    
close:
    /* Free the memory */
    free(tab_rp_bits);
    free(tab_rp_registers);

    /* Close the connection */
    modbus_close(ctx);
    modbus_free(ctx);

  return 0;
}
