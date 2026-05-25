export interface Product {
  id: number; // Added id field for unique identification
  PID: number;
  UID: string;
  ItemName: string;
  Balance: number;
}

export interface Member {
  id: number; // Added id field for unique identification
  MEMID: number;
  Name: string;
  Rank: string;
  GNO: number;
}

export const products: Product[] = [
  {
    "id": 1,
    "PID": 1,
    "UID": "1217",
    "ItemName": "Greyhounds Logo Printed Big",
    "Balance": 208
  },
  {
    "id": 2,
    "PID": 2,
    "UID": "1250",
    "ItemName": "Bathroom Set",
    "Balance": 1
  },
  {
    "id": 3,
    "PID": 3,
    "UID": "765       ",
    "ItemName": "APP Officer Monogram",
    "Balance": 7
  },
  {
    "id": 4,
    "PID": 4,
    "UID": "765       ",
    "ItemName": "APP Officer Monogram",
    "Balance": 35
  },
  {
    "id": 5,
    "PID": 5,
    "UID": "106",
    "ItemName": "Short white dazzle M L XL XXL",
    "Balance": 3
  },
  {
    "id": 6,
    "PID": 6,
    "UID": "3993",
    "ItemName": "GRYHOUNDS LOGO SHOLDER",
    "Balance": 46
  },
  {
    "id": 7,
    "PID": 7,
    "UID": "3994",
    "ItemName": "GRYHOUNDS LOGO 5 YEARS SENIORS",
    "Balance": 89
  },
  {
    "id": 8,
    "PID": 8,
    "UID": "496",
    "ItemName": "Cool Water Can",
    "Balance": 2
  },
  {
    "id": 9,
    "PID": 9,
    "UID": "3735",
    "ItemName": "OTTO PERFUME 200ML",
    "Balance": 3
  },
  {
    "id": 10,
    "PID": 10,
    "UID": "2674",
    "ItemName": "WOMEN  HORLIKS 450GM RIFIL",
    "Balance": 8
  },
  {
    "id": 11,
    "PID": 11,
    "UID": "658       ",
    "ItemName": "T Shirt Dazzle PT",
    "Balance": 19
  },
  {
    "id": 12,
    "PID": 12,
    "UID": "3860",
    "ItemName": "Hand gloves wollen",
    "Balance": 1
  },
  {
    "id": 13,
    "PID": 13,
    "UID": "1128",
    "ItemName": "Elbow Supportt",
    "Balance": 2
  },
  {
    "id": 14,
    "PID": 14,
    "UID": "465       ",
    "ItemName": "Pull though card&weight",
    "Balance": 21
  },
  {
    "id": 15,
    "PID": 15,
    "UID": "3430",
    "ItemName": "JUNGLE CAP ROUND",
    "Balance": 37
  },
  {
    "id": 16,
    "PID": 16,
    "UID": "765",
    "ItemName": "APP Officer Monogram",
    "Balance": 7
  },
  {
    "id": 17,
    "PID": 17,
    "UID": "3673",
    "ItemName": "T SHIRT SLIM FIT",
    "Balance": 64
  },
  {
    "id": 18,
    "PID": 18,
    "UID": "3220",
    "ItemName": "SHORT SP m l xl xxl",
    "Balance": 10
  },
  {
    "id": 19,
    "PID": 19,
    "UID": "4142",
    "ItemName": "Led Serial light",
    "Balance": 1
  },
  {
    "id": 20,
    "PID": 20,
    "UID": "3178",
    "ItemName": "face mask",
    "Balance": 162
  },
  {
    "id": 21,
    "PID": 21,
    "UID": "734",
    "ItemName": "Knee Cap",
    "Balance": 1
  },
  {
    "id": 22,
    "PID": 22,
    "UID": "134       ",
    "ItemName": "Supporter",
    "Balance": 4
  },
  {
    "id": 23,
    "PID": 23,
    "UID": "885",
    "ItemName": "Kenwood Black Shoe00",
    "Balance": 3
  },
  {
    "id": 24,
    "PID": 24,
    "UID": "4228",
    "ItemName": "XYX R50 LOWER",
    "Balance": 4
  },
  {
    "id": 25,
    "PID": 25,
    "UID": "2630      ",
    "ItemName": "Shorts PT Dazzle",
    "Balance": 53
  },
  {
    "id": 26,
    "PID": 26,
    "UID": "4271",
    "ItemName": "CITY 99 -999 HOT BOX",
    "Balance": 1
  },
  {
    "id": 27,
    "PID": 27,
    "UID": "4266",
    "ItemName": "MACH 3 CHARCOAL RAZOR",
    "Balance": 1
  },
  {
    "id": 28,
    "PID": 28,
    "UID": "3534",
    "ItemName": "CURD SQVEEZER",
    "Balance": 4
  },
  {
    "id": 29,
    "PID": 29,
    "UID": "3479",
    "ItemName": "XYX R20 TRUNK",
    "Balance": 12
  },
  {
    "id": 30,
    "PID": 30,
    "UID": "3013",
    "ItemName": "DANGREY NEWW",
    "Balance": 10
  }
];

export const members: Member[] = [
   {
    "id": 1,
    "MEMID": 1,
    "Name": "welfare canteen .ghs",
    "Rank": "DGP",
    "GNO": 7500
  },
  {
    "id": 2,
    "MEMID": 2,
    "Name": "P. SEETA RAMANJANEYULU IPS",
    "Rank": "IGP",
    "GNO": 7501
  },
  {
    "id": 3,
    "MEMID": 3,
    "Name": "VENKATESWARULU CHOUTURI",
    "Rank": "DIG",
    "GNO": 7579
  },
  {
    "id": 4,
    "MEMID": 4,
    "Name": "NARAYANA NAIK K",
    "Rank": "GC",
    "GNO": 7507
  },
  {
    "id": 5,
    "MEMID": 5,
    "Name": "ASHOK KUMAR E",
    "Rank": "GC",
    "GNO": 7518
  },
  {
    "id": 6,
    "MEMID": 6,
    "Name": "V.JAGADISH KUMAR",
    "Rank": "GC",
    "GNO": 7535
  },
  {
    "id": 7,
    "MEMID": 7,
    "Name": "M.RAVINDRANATH BABU",
    "Rank": "GC",
    "GNO": 7508
  },
  {
    "id": 8,
    "MEMID": 8,
    "Name": "M.STEPHEN RAVEENDRA,IPS",
    "Rank": "DIG",
    "GNO": 7510
  },
  {
    "id": 9,
    "MEMID": 9,
    "Name": "B.RAM PRAKASH",
    "Rank": "SQCOM",
    "GNO": 7515
  },
  {
    "id": 10,
    "MEMID": 10,
    "Name": "SRINIVAS RAO N",
    "Rank": "SQCOM",
    "GNO": 7532
  },
  {
    "id": 11,
    "MEMID": 11,
    "Name": "JAI HIND R",
    "Rank": "SQCOM",
    "GNO": 7522
  },
  {
    "id": 12,
    "MEMID": 12,
    "Name": "SYED BIN IBRAHIM",
    "Rank": "SQCOM",
    "GNO": 7536
  },
  {
    "id": 13,
    "MEMID": 13,
    "Name": "ANANDA BABU T",
    "Rank": "SQCOM",
    "GNO": 7919
  },
  {
    "id": 14,
    "MEMID": 14,
    "Name": "RAVI SANKAR P",
    "Rank": "SQCOM",
    "GNO": 7651
  },
  {
    "id": 15,
    "MEMID": 15,
    "Name": "P.SEETHARAM",
    "Rank": "SQCOM",
    "GNO": 7516
  },
  {
    "id": 16,
    "MEMID": 16,
    "Name": "SUDHAKAR RAO K",
    "Rank": "SQCOM",
    "GNO": 7537
  },
  {
    "id": 17,
    "MEMID": 17,
    "Name": "GHANTA DAYANAND",
    "Rank": "AC",
    "GNO": 7633
  },
  {
    "id": 18,
    "MEMID": 18,
    "Name": "ANJAIAH ANNAVARAPU",
    "Rank": "AC",
    "GNO": 7684
  },
  {
    "id": 19,
    "MEMID": 19,
    "Name": "SHIVA PRASAD NAINALA",
    "Rank": "AC",
    "GNO": 7748
  },
  {
    "id": 20,
    "MEMID": 20,
    "Name": "SRINIVASA RAO EROTHU",
    "Rank": "AC",
    "GNO": 7833
  },
  {
    "id": 21,
    "MEMID": 21,
    "Name": "BILLU ADINARAYANA",
    "Rank": "AC",
    "GNO": 7787
  },
  {
    "id": 22,
    "MEMID": 22,
    "Name": "NAGESWARA RAO RAYUDU",
    "Rank": "AC",
    "GNO": 7786
  },
  {
    "id": 23,
    "MEMID": 23,
    "Name": "VENKATAIAH RAMAPURAM",
    "Rank": "AC",
    "GNO": 7637
  },
  {
    "id": 24,
    "MEMID": 24,
    "Name": "SRINIVASA RAO K",
    "Rank": "AC",
    "GNO": 7677
  },
  {
    "id": 25,
    "MEMID": 25,
    "Name": "BULA VIJAYA KUMAR",
    "Rank": "AC",
    "GNO": 7660
  }
];