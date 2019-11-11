# -*- coding: utf-8 -*-
import pandas as pd
from openpyxl import load_workbook
from pylab import *
import matplotlib.pyplot as plt

filename = "ddobak.xlsx"

# maxindex = 303

sheets = []
# s_lfsr1 = []

wb = load_workbook(filename)
for i in wb.get_sheet_names():
    sheets.append(i)


def readCell(sheet):
    temp = []
    for row in sheet:
        for cell in row:
            temp.append(cell.value)
    return temp


def fsrTransfer(index, lcolno, rcolno):
    ddf = pd.read_excel(filename, sheet_name=sheets[index])
    temp = ddf.T._values.tolist()
    lfsr = sorted(temp[lcolno])
    rfsr = sorted(temp[rcolno])

    data = {'Lfsr': lfsr,
            'Rfsr': rfsr}
    tempdf = pd.DataFrame(data)
    return tempdf


def savefig(df, fsrname):
    plt.pcolor(df)
    plt.xticks(np.arange(0.5, len(df.columns), 1), df.columns)
    plt.yticks(np.arange(0.5, 35, 5), np.arange(0, 35, 5))
    # plt.title('Heatmap on '+fsrname)
    plt.colorbar()
    plt.savefig("./public/images/" + fsrname+'.png', format='png')


def savefig2(df, fsrname):
    plt.pcolor(df)
    plt.xticks(np.arange(0.5, len(df.columns), 1), df.columns)
    plt.yticks(np.arange(0.5, 35, 5), np.arange(0, 35, 5))
    # plt.title('Heatmap on '+fsrname)
    plt.savefig("./public/images/" + fsrname+'.png', format='png')


savefig(fsrTransfer(len(sheets)-1,0,5), 'fsr1')
savefig2(fsrTransfer(len(sheets)-1,1,6), 'fsr2')
savefig2(fsrTransfer(len(sheets)-1,2,7), 'fsr3')
savefig2(fsrTransfer(len(sheets)-1,3,8), 'fsr4')

print('sfc')
