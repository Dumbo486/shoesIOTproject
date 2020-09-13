# shoesIOTproject
아두이노와 센서들을 활용한 스마트슈즈 프로젝트
( 걸음걸이 분석을 통한 자세 셀프 모니터링 도우미 )


![스크린샷 2020-09-11 오후 12 07 42](https://user-images.githubusercontent.com/48663295/93008920-8657ad00-f5b5-11ea-9b93-0de8ef066134.png){: width="100%" height="100%"}

## 제작 신발 사진 

![image](https://user-images.githubusercontent.com/48663295/93009080-56110e00-f5b7-11ea-9d24-62d292100942.png)
![image](https://user-images.githubusercontent.com/48663295/93009106-aab48900-f5b7-11ea-8151-c662ec574ac8.png)

- 오픈소스 하드웨어 : Arduino Uno rev3
- 압력센서 FSR402 8개
- 자이로센서 mpu9250 2개
- 블루투스 모듈HC-06 2개 

## 동작 순서

1. 아두이노를 이용하여 제작된 신발을 신고 걸으면, 신발에 부착된 압력센서와 자이로센서로 측정된 약 5초 간의 걸음 데이터가 엑셀파일로 저장된다.
2. 엑셀파일을 파이썬으로 읽어와 전처리과정(FFT)을 거친 후 분류기(인공지능)를 사용하여 본인이 어떤 걸음걸이를 가지고 있는지 제시해준다.
3. 클러스터링 활용해 자신과 비슷한 걸음걸이를 가지고 있는 사람을 분류해 시각화하여 보여준다.


## 주요 코드

### 자이로센서 2차원 변환을 위한 필터 적용
```
void get_calibration_Data ()
{
    for (int i = 0; i < sample_num_mdate; i++)
    {
        get_one_sample_date_mxyz();

        if (mx_sample[2] >= mx_sample[1])mx_sample[1] = mx_sample[2];
        if (my_sample[2] >= my_sample[1])my_sample[1] = my_sample[2]; //find max value
        if (mz_sample[2] >= mz_sample[1])mz_sample[1] = mz_sample[2];

        if (mx_sample[2] <= mx_sample[0])mx_sample[0] = mx_sample[2];
        if (my_sample[2] <= my_sample[0])my_sample[0] = my_sample[2]; //find min value
        if (mz_sample[2] <= mz_sample[0])mz_sample[0] = mz_sample[2];

    }

    mx_max = mx_sample[1];
    my_max = my_sample[1];
    mz_max = mz_sample[1];

    mx_min = mx_sample[0];
    my_min = my_sample[0];
    mz_min = mz_sample[0];

    mx_centre = (mx_max + mx_min) / 2;
    my_centre = (my_max + my_min) / 2;
    mz_centre = (mz_max + mz_min) / 2;
}

void get_one_sample_date_mxyz()
{
    getCompass_Data();
    mx_sample[2] = Mxyz[0];
    my_sample[2] = Mxyz[1];
    mz_sample[2] = Mxyz[2];
}

void getAccel_Data(void)
{
    accelgyro.getMotion9(&ax, &ay, &az, &gx, &gy, &gz, &mx, &my, &mz);
    Axyz[0] = (double) ax / 16384;
    Axyz[1] = (double) ay / 16384;
    Axyz[2] = (double) az / 16384;
}

void getGyro_Data(void)
{
    accelgyro.getMotion9(&ax, &ay, &az, &gx, &gy, &gz, &mx, &my, &mz);

    Gxyz[0] = (double) gx * 250 / 32768;
    Gxyz[1] = (double) gy * 250 / 32768;
    Gxyz[2] = (double) gz * 250 / 32768;
}

void getCompass_Data(void)
{
    I2C_M.writeByte(MPU9150_RA_MAG_ADDRESS, 0x0A, 0x01); //enable the magnetometer
    delay(10);
    I2C_M.readBytes(MPU9150_RA_MAG_ADDRESS, MPU9150_RA_MAG_XOUT_L, 6, buffer_m);

    mx = ((int16_t)(buffer_m[1]) << 8) | buffer_m[0] ;
    my = ((int16_t)(buffer_m[3]) << 8) | buffer_m[2] ;
    mz = ((int16_t)(buffer_m[5]) << 8) | buffer_m[4] ;

    Mxyz[0] = (double) mx * 1200 / 4096;
    Mxyz[1] = (double) my * 1200 / 4096;
    Mxyz[2] = (double) mz * 1200 / 4096;
}

void getCompassDate_calibrated ()
{
    getCompass_Data();
    Mxyz[0] = Mxyz[0] - mx_centre;
    Mxyz[1] = Mxyz[1] - my_centre;
    Mxyz[2] = Mxyz[2] - mz_centre;
}
```

### 블루투스 모듈과 통신하기
```
import bluetooth
#connect bluetooth 1
    sock=bluetooth.BluetoothSocket(bluetooth.RFCOMM)
    sock.connect((lshoesize, port))
    print('1success')
    sock.setblocking(False)
    sock.settimeout(20.0)
    #recieve bluetooth 1
    temp = sock.recv(256)
    print('recv1')
```
Installing PyBluez using pip
```
pip install pybluez
```

### 데이터전처리 fft(푸리에변환)
```
from scipy.fftpack import fft, ifft
def makeFFT(fsrList):
    maxval = fsrList[fsrList.index(max(fsrList))]
    newFsrlist = []
    for i in fsrList:
        try:
            value = float(i) / maxval
        except ZeroDivisionError as e:
            print(e)
            value = 0
        # newFsrlist.append(float(i) / maxval)
        newFsrlist.append(value)

    fourier = fft(newFsrlist)

    freal = []
    for i in fourier:
        freal.append(i.real)

    return freal

```
## 웹 구동 화면 

![image](https://user-images.githubusercontent.com/48663295/93009404-9a9ea880-f5bb-11ea-869e-34867693c476.png)
![image](https://user-images.githubusercontent.com/48663295/93009405-9d010280-f5bb-11ea-9d04-b996d52d92cb.png)
