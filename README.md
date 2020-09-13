# shoesIOTproject
아두이노와 센서들을 활용한 스마트슈즈 프로젝트
( 걸음걸이 분석을 통한 자세 셀프 모니터링 도우미 )


![스크린샷 2020-09-11 오후 12 07 42](https://user-images.githubusercontent.com/48663295/93008920-8657ad00-f5b5-11ea-9b93-0de8ef066134.png)

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
pybluez : https://pybluez.readthedocs.io/en/latest/install.html

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

