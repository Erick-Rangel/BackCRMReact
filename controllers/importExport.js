const sql = require('mssql')
const fs = require('fs');
const config = require('../db/configDb');
const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcryptjs');

exports.exportData = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .execute('SP_mostrardatos')
        const fileName = 'usuarios.csv';
        const data = result.recordset;

        let csvData = '';

        // Iteramos sobre cada registro de la tabla
        data.forEach((record) => {
            // Creamos una línea del archivo CSV con los valores del registro
            let line = '';
            Object.keys(record).forEach((key) => {
                if(key !== 'Id'){
                line += `"${record[key]}",`;
                }
            });
            //Agregamos el nombre de cada columna
            if (csvData === '') {
                csvData += Object.keys(record).filter((key) => key !== 'Id').join(',') + '\n';
            }

            // Removemos la última coma y agregamos un salto de línea
            csvData += line.slice(0, -1) + '\n';
        });

        // Escribimos el archivo CSV
        fs.writeFile

            (fileName, csvData, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    res.attachment(fileName)
                    res.status(200).send(csvData)
                    console.log(`El archivo ${fileName} ha sido creado exitosamente`);
                }
            })

    } catch (err) {
        console.log(err);
    }
}



exports.importDataCSV = async (req, res,next) => {
    const pool = await sql.connect(config);
    const rows = req.body;
    console.log(rows)
    //Delete rows undefined
    const rowsFilter = rows.filter(row => row !== null && row !== undefined && row !== '');
    const existingEmails = []
    rowsFilter.forEach(async (row) => {
        // Checking if the user is already in the database
        const ExistEmail = pool.request()
        .input('Correo', row.Email)
        .execute('SP_validarcorreo',async function(err,recordset){
            if(err) console.log(err)
           /*  console.log(recordset.recordset) */
            if(recordset.recordset.length > 0){
                existingEmails.push(row.Email)
               
            }else if(row.Name !== ''){
                //Create id
                const id = uuidv4();
                // Hash passwords
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(row?.Password, salt);
                // Create a new user
            const user = await pool.request()
                .input('id', id)
                .input('Nombre', row.Name)
                .input('Usuario', row.Users)
                .input('Correo', row.Email)
                .input('Apellido', row.LastName)
                .input('Contraseña', hashed)
                .input('id_rol', row.id_rol)
                .input('Divisas', row.Currency)
                .input('Simbolo', row.Symbol)
                .input('Agrupacion', row.Agrupation)
                .input('SeparadorDecimales', row.SeparateDecimal)
                .input('Simbolodeladivisa', row.CurrencySymbolPlace)
                .input('DecimalesCampos', row.DecimalsCamps)
                .input('Posiciones', row.Position)
                .input('Fax', row.Fax)
                .input('Departamentos', row.Departmen)
                .input('Correo2', row.Email2)
                .input('TelefonoOficina', row.TelOffice)
                .input('TelefonoMovil', row.TelMovil)
                .input('TelefonoCasa', row.TelHome)
                .input('Informa', row.InformTo)
                .input('Telefonodirecto', row.TelDirection)
                .input('Firma', row.Firm)
                .input('Documentos', row.Documents)
                .input('CorreoInternos', row.ClientEmailInter)
                .input('Lenguaje', row.Lenguage)
                .input('ExtencionCrm', row.CRMPhone)
                .input('VistaDefecto', row.ViewRegisterDefect)
                .input('Direccion', row.Direction)
                .input('Ciudad', row.Country)
                .input('Municipio', row.Municipality)
                .input('CodigoPostal', row.PostalCode)
                .input('Estado', row.State)
                .input('Admin', row.Admin)
                .input('Imagen', row.Image)
                .execute('SP_nombreyquehace', function(err,recordset){
                    if(err){ 
                        console.log(err) 
                        return
                    }
                })
            }
        })
    })
        setTimeout(
        function(){
    return res.send(existingEmails)
        }, 500
    )
}



        
