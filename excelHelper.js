'use strict';

const xlsx = require("xlsx");

function readFromFile(fullFilename, firstRowAsColumn) {
    let workbook = xlsx.readFile(fullFilename);
    let wbInfo = structure(workbook, firstRowAsColumn);
    return wbInfo;
}

var structure = function (workbook, firstRowAsColumn) {
    let sheetInfos = [];
    let sheetNames = workbook.SheetNames;

    if (!sheetNames || !sheetNames.length) {
        return;
    }

    let fnFillNames = function () {
        sheetNames.forEach((item) => {
            sheetInfos.push({
                sheetName: item
            });
        });
    };

    /*
        {String}refText 数据范围描述，例如 A1:AB11
     */
    let fnGetColRowIndex = function (refText) {
        let splited = refText.split(":");

        let fnGetIndex = function (indexRef) {
            let col = indexRef.replace(/[\d*]+/, "");
            let row = indexRef.replace(/[^\d*]+/, "");

            return {
                rowIndex: parseInt(row),
                colIndex: FromNumberSystem26(col),
            };
        };

        let begin = fnGetIndex(splited[0]);
        let end = fnGetIndex(splited[1]);
        return {
            beginColIndex: begin.colIndex,
            beginRowIndex: begin.rowIndex,
            endColIndex: end.colIndex,
            endRowIndex: end.rowIndex,
        };
    };

    let fnColumnIncludes = function (columns, targetItem) {
        if (columns.length == 0) {
            return false;
        }

        for (let item of columns) {
            if (item.title == targetItem.title) {
                return true;
            }
        }

        return false;
    };

    let fnHandleColumn = function (columns, columnPos, title) {
        if (title.length == 0) {
            title = columnPos;
        }

        let item = {
            title,
            columnPos,
        };

        if (fnColumnIncludes(columns, item)) {
            item.title += "_" + columnPos;
        }

        columns.push(item);
    };

    let fnFillData = function (sheet, refText, sheetInfo) {
        let data = sheetInfo.data;
        let columns = sheetInfo.columns;
        let indexInfo = fnGetColRowIndex(refText);

        for (let iRow = indexInfo.beginRowIndex; iRow <= indexInfo.endRowIndex; ++iRow) {
            let row = {};
            let isColumn = false;

            for (let jCol = indexInfo.beginColIndex; jCol <= indexInfo.endColIndex; ++jCol) {
                let columnPos = ToNumberSystem26(jCol);
                let cellPos = `${columnPos}${iRow}`;
                let cell = sheet[cellPos];
                let val;

                if (cell) {
                    val = cell.v;
                } else {
                    val = "";
                }

                if (iRow == indexInfo.beginRowIndex && firstRowAsColumn) {
                    isColumn = true;
                    fnHandleColumn(columns, columnPos, val);
                } else {
                    // 如果使用了首行作为列名，那么每行数据的key以列名为key
                    if (firstRowAsColumn) {
                        let targetCol = columns.find((col) => {
                            return (col.columnPos == columnPos);
                        });
                        row[targetCol.title] = val;
                    } else {
                        row[cellPos] = val;
                    }
                }
            } // end for

            if (!isColumn) {
                data.push(row);
            }

        } // end for
    };


    let fnHandleSheet = function (sheetInfo) {
        sheetInfo.data = [];
        sheetInfo.columns = [];

        let maxRowIndex, // 行索引上限
            maxColIndex; // 列索引上限
        let startColCharCode, // 开始列名字符
            endColCharCode; // 结束列名字符
        let sheet = workbook.Sheets[sheetInfo.sheetName];
        let refText = sheet["!ref"];

        // 空的工作表
        if (!refText) {
            return;
        }

        fnFillData(sheet, refText, sheetInfo);
    };


    // console.log("sheet names:");
    // console.log(sheetNames);

    fnFillNames();
    sheetInfos.forEach((item) => {
        fnHandleSheet(item);
    });

    //  console.log(sheetInfos);
    return sheetInfos;
};


/// <summary>
/// 将指定的26进制表示转换为自然数。映射关系：[A-Z] ->[1-26]。
/// </summary>
/// <param name="s">26进制表示（如果无效，则返回0）。</param>
/// <returns>自然数。</returns>
function FromNumberSystem26(s) {
    let n = 0;

    if (s == null || s == "") {
        return n;
    }

    for (let i = s.length - 1, j = 1; i >= 0; i-- , j *= 26) {
        let c = s[i].toUpperCase();
        if (c < 'A' || c > 'Z') {
            return 0;
        }

        n += (c.charCodeAt(0) - 64) * j;
    }

    return n;
}

/// <summary>
/// 将指定的自然数转换为26进制表示。映射关系：[1-26] ->[A-Z]。
/// </summary>
/// <param name="n">自然数（如果无效，则返回空字符串）。</param>
/// <returns>26进制表示。</returns>
function ToNumberSystem26(n) {
    let s = "";

    while (n > 0) {
        let m = n % 26;

        if (m == 0) {
            m = 26;
        }

        s = String.fromCharCode(m + 64) + s;
        n = (n - m) / 26;
    }

    return s;
}

exports.readFromFile = readFromFile;