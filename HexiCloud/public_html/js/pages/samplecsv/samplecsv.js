/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(['knockout', 'ojs/ojcore', 'jquery', 'ojs/ojbutton'], 
    function(ko, $) {
    
    function sampleCSVViewModel(params) {
        var self = this;
        var router = params.ojRouter.parentRouter;
        
        self.resultData = ko.observable('Sample Text before calling the JSON..');
        
        self.getCSVData = function() {
            $.ajax({
                type: "GET",
                contentType: "application/json",
//                url: 'pages/sampleCSV/sample.json',
                url: 'https://api.github.com/users/mralexgray/repos',
                success: function (result) {
                    self.resultData(ko.toJSON(result));
                    JSONToCSVConvertor(result, 'Sample CSV File', true);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('Error retrieving details..');
                    console.log(xhr);
                    console.log(ajaxOptions);
                    console.log(thrownError);
                }
            });
        };
        
        self.getXLSData = function() {
            $.ajax({
                type: "GET",
                contentType: "application/json",
//                url: 'pages/sampleCSV/sample.json',
                url: 'https://api.github.com/users/mralexgray/repos',
                success: function (result) {
                    self.resultData(ko.toJSON(result));
                    JSONToXLSConverter(result, 'Sample XLS File', true);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('Error retrieving details..');
                    console.log(xhr);
                    console.log(ajaxOptions);
                    console.log(thrownError);
                }
            });
        };

        // Simple type mapping; dates can be hard
        // and I would prefer to simply use `datevalue`
        // ... you could even add the formula in here.
        testTypes = {};

        emitXmlHeader = function (headerObj) {
            var headerRow =  '<ss:Row>\n';
            for (var colName in headerObj) {
                testTypes[colName] = typeof colName;
            }
            for (var colName in headerObj) {
                headerRow += '  <ss:Cell>\n';
                headerRow += '    <ss:Data ss:Type="String">';
                headerRow += colName + '</ss:Data>\n';
                headerRow += '  </ss:Cell>\n';        
            }
            headerRow += '</ss:Row>\n';
            return '<?xml version="1.0"?>\n' +
                   '<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n' +
                   '<ss:Worksheet ss:Name="Sheet1">\n' +
                   '<ss:Table>\n\n' + headerRow;
        };

        emitXmlFooter = function() {
            return '\n</ss:Table>\n' +
                   '</ss:Worksheet>\n' +
                   '</ss:Workbook>\n';
        };

        download = function (content, fileName, contentType) {
            if (contentType === undefined) {
                contentType = 'application/octet-stream';
            }
            console.log(contentType);
            // we have to generate a temp <a /> tag and remove it
            var link = document.createElement("a"); 
            var blob = new Blob([content], {
                'type': contentType
            });  
            link.href = window.URL.createObjectURL(blob);

            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = fileName;

            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
      
        function JSONToXLSConverter(JSONData, FileTitle) {
            var row;
            var col;
            var xml;
            var data = typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;
            console.log(JSONData);
            console.log(JSONData[0]);
            xml = emitXmlHeader(JSONData[0]);

            for (row = 0; row < data.length; row++) {
                xml += '<ss:Row>\n';

                for (col in data[row]) {
                    xml += '  <ss:Cell>\n';
//                    xml += '    <ss:Data ss:Type="' + testTypes[col]  + '">';
                    xml += '    <ss:Data ss:Type="String">';
                    xml += data[row][col] + '</ss:Data>\n';
                    xml += '  </ss:Cell>\n';
                }

                xml += '</ss:Row>\n';
            }

            xml += emitXmlFooter();
            FileTitle = FileTitle.replace(/ /g,"_");
            download(xml, FileTitle + ".xls", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        }
        
        function JSONToCSVConvertor(JSONData, FileTitle, ShowLabel) {
            var CSVData = '';
            
            // This condition will generate the Header columns
            if (ShowLabel) {
                var row = "";
                for (var index in JSONData[0]) {
                    row += index + ',';
                }
                // removes comma for last index
                row = row.slice(0, -1);
                CSVData += row + '\r\n';
            }

            // 1st loop is to extract each row
            for (var i = 0; i < JSONData.length; i++) {
                var row = "";

                // 2nd loop will extract each column and convert it in string comma-seprated
                for (var index in JSONData[i]) {
                    row += '"' + JSONData[i][index] + '",';
                }
                row.slice(0, row.length - 1);

                // add a line break after each row
                CSVData += row + '\r\n';
            }

            if (CSVData === "") {
                alert("Invalid json data");
                return;
            } else {
                // this will remove the blank-spaces from the title and replace it with an underscore
                FileTitle = FileTitle.replace(/ /g,"_");
                download(CSVData, FileTitle + ".csv", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            }
        }
    };
    
    return sampleCSVViewModel;
});
