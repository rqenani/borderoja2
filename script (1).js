
        $(document).ready(function () {

        function updateDitari() {
            // Merr të dhënat nga totalet e tabelës kryesore
            const totalGrossSalary = parseFloat($('#totalGrossSalary').text()) || 0;
            const totalEmployerSocial = parseFloat($('#totalEmployerSocial').text()) || 0;
            const totalNetSalary = parseFloat($('#totalNetSalary').text()) || 0;
            const totalTAP = parseFloat($('#totalTAP').text()) || 0;
            const totalSocial = parseFloat($('#totalSocial').text()) || 0;

            // Përditëso rreshtat përkatës në tabelën e Ditari
            $('#ditariGrossSalary').text(totalGrossSalary.toFixed(2));
            $('#ditariEmployerSocial').text(totalEmployerSocial.toFixed(2));
            $('#ditariNetSalary').text(totalNetSalary.toFixed(2));
            $('#ditariTAP').text(totalTAP.toFixed(2));
            $('#ditariTotalInsurance').text(totalSocial.toFixed(2));
        }

            const MAX_TAXABLE_SALARY = 176416;

            const table = $('#listTable').DataTable({
                dom: 'Bfrtip',
                buttons: [
                    { extend: 'excelHtml5', text: 'Eksporto të plotë', className: 'btn' },
                    { extend: 'csvHtml5', text: 'Eksporto Neto', className: 'btn', exportOptions: { columns: [1, 14] } },
                    { extend: 'pdfHtml5', text: 'Eksporto në PDF', className: 'btn' },
                    { extend: 'print', text: 'Printo', className: 'btn' }
                ]
            });

            function calculateTAP(grossSalary) {
                let tap = 0;
                if (grossSalary > 200000) {
                    tap = 22100 + ((grossSalary - 200000) * 0.23);
                } else if (grossSalary > 60000) {
                    tap = (grossSalary - 30000) * 0.13;
                } else if (grossSalary > 50000) {
                    tap = (grossSalary - 35000) * 0.13;
                }
                return tap.toFixed(2);
            }

            function calculateRowTotals(row) {
                const grossSalary = parseFloat(row.find('td:eq(2)').text()) || 0;
                const taxableSalary = parseFloat(row.find('td:eq(3)').text()) || grossSalary;

                const socialSecurityEmployer = (taxableSalary * 0.15).toFixed(2);
                const socialSecurityEmployee = (taxableSalary * 0.095).toFixed(2);
                const healthInsuranceEmployee = ((grossSalary > MAX_TAXABLE_SALARY ? grossSalary : taxableSalary) * 0.017).toFixed(2);
                const healthInsuranceEmployer = ((grossSalary > MAX_TAXABLE_SALARY ? grossSalary : taxableSalary) * 0.017).toFixed(2);

                const supplementEmployee = parseFloat(row.find('td:eq(10)').text()) || 0;
                const supplementEmployer = parseFloat(row.find('td:eq(11)').text()) || 0;
                const supplementTotal = (supplementEmployee + supplementEmployer).toFixed(2);

                const tap = calculateTAP(grossSalary);

                const netSalary = (
                    grossSalary -
                    parseFloat(socialSecurityEmployee) -
                    parseFloat(healthInsuranceEmployee) -
                    parseFloat(tap) -
                    parseFloat(supplementEmployee)
                ).toFixed(2);

                row.find('td:eq(4)').text(socialSecurityEmployer);
                row.find('td:eq(5)').text(socialSecurityEmployee);
                row.find('td:eq(6)').text((parseFloat(socialSecurityEmployer) + parseFloat(socialSecurityEmployee)).toFixed(2));
                row.find('td:eq(7)').text(healthInsuranceEmployee);
                row.find('td:eq(8)').text(healthInsuranceEmployer);
                row.find('td:eq(9)').text((parseFloat(healthInsuranceEmployee) + parseFloat(healthInsuranceEmployer)).toFixed(2));
                row.find('td:eq(12)').text(supplementTotal);
                row.find('td:eq(13)').text(tap);
                row.find('td:eq(14)').text(netSalary);
            }

            function updateTotals() {
                let totalGrossSalary = 0,
                    totalTaxableSalary = 0,
                    totalEmployerSocial = 0,
                    totalEmployeeSocial = 0,
                    totalSocial = 0,
                    totalHealthInsuranceEmployee = 0,
                    totalHealthInsuranceEmployer = 0,
                    totalHealthInsurance = 0,
                    totalEmployeeSupplement = 0,
                    totalEmployerSupplement = 0,
                    totalSupplement = 0,
                    totalTAP = 0,
                    totalNetSalary = 0;

                $('#listTable tbody tr').each(function () {
                    const row = $(this);
                    calculateRowTotals(row);

                    totalGrossSalary += parseFloat(row.find('td:eq(2)').text()) || 0;
                    totalTaxableSalary += parseFloat(row.find('td:eq(3)').text()) || 0;
                    totalEmployerSocial += parseFloat(row.find('td:eq(4)').text()) || 0;
                    totalEmployeeSocial += parseFloat(row.find('td:eq(5)').text()) || 0;
                    totalSocial += parseFloat(row.find('td:eq(6)').text()) || 0;
                    totalHealthInsuranceEmployee += parseFloat(row.find('td:eq(7)').text()) || 0;
                    totalHealthInsuranceEmployer += parseFloat(row.find('td:eq(8)').text()) || 0;
                    totalHealthInsurance += parseFloat(row.find('td:eq(9)').text()) || 0;
                    totalEmployeeSupplement += parseFloat(row.find('td:eq(10)').text()) || 0;
                    totalEmployerSupplement += parseFloat(row.find('td:eq(11)').text()) || 0;
                    totalSupplement += parseFloat(row.find('td:eq(12)').text()) || 0;
                    totalTAP += parseFloat(row.find('td:eq(13)').text()) || 0;
                    totalNetSalary += parseFloat(row.find('td:eq(14)').text()) || 0;
                });

                $('#totalGrossSalary').text(totalGrossSalary.toFixed(2));
                $('#totalTaxableSalary').text(totalTaxableSalary.toFixed(2));
                $('#totalEmployerSocial').text(totalEmployerSocial.toFixed(2));
                $('#totalEmployeeSocial').text(totalEmployeeSocial.toFixed(2));
                $('#totalSocial').text(totalSocial.toFixed(2));
                $('#totalHealthInsuranceEmployee').text(totalHealthInsuranceEmployee.toFixed(2));
                $('#totalHealthInsuranceEmployer').text(totalHealthInsuranceEmployer.toFixed(2));
                $('#totalHealthInsurance').text(totalHealthInsurance.toFixed(2));
                $('#totalEmployeeSupplement').text(totalEmployeeSupplement.toFixed(2));
                $('#totalEmployerSupplement').text(totalEmployerSupplement.toFixed(2));
                $('#totalSupplement').text(totalSupplement.toFixed(2));
                $('#totalTAP').text(totalTAP.toFixed(2));
                $('#totalNetSalary').text(totalNetSalary.toFixed(2));
            }

            $('#addMultipleEmployees').on('click', function () {
                const numEmployees = parseInt($('#numEmployees').val()) || 0;
                const baseSalary = parseFloat($('#baseSalary').val()) || 40000;

                for (let i = 0; i < numEmployees; i++) {
                    const row = table.row.add([
                        `ID-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
                        "Emër Mbiemër",
                        baseSalary.toFixed(2),
                        baseSalary.toFixed(2),
                        "0.00", "0.00", "0.00",
                        "0.00", "0.00", "0.00",
                        "0.00", "0.00", "0.00",
                        "0.00", "0.00",
                        `<button class="btn delete-row">Fshi</button>`
                    ]).draw(false).node();

                    $(row).find('td').attr('contenteditable', 'true');
                }

                updateTotals();
            updateDitari();
            });

            $('#listTable tbody').on('click', '.delete-row', function () {
                table.row($(this).closest('tr')).remove().draw(false);
                updateTotals();
            updateDitari();
            });

            $('#listTable tbody').on('input', 'td[contenteditable="true"]', function () {
                const row = $(this).closest('tr');
                calculateRowTotals(row);
                updateTotals();
            updateDitari();
            });

            updateTotals();
            updateDitari();
        });
    
    function updateDitari() {
        // Merr të dhënat nga totalet e tabelës kryesore
        const totalGrossSalary = parseFloat($('#totalGrossSalary').text()) || 0;
        const totalEmployerSocial = parseFloat($('#totalEmployerSocial').text()) || 0;
        const totalEmployeeSocial = parseFloat($('#totalEmployeeSocial').text()) || 0;
        const totalEmployerSupplement = parseFloat($('#totalEmployerSupplement').text()) || 0;
        const totalEmployeeSupplement = parseFloat($('#totalEmployeeSupplement').text()) || 0;
        const totalNetSalary = parseFloat($('#totalNetSalary').text()) || 0;
        const totalTAP = parseFloat($('#totalTAP').text()) || 0;
        const totalSocial = parseFloat($('#totalSocial').text()) || 0;

        // Përllogarit shpenzimet vetëm për kontributet shoqërore (social)
        const totalSocialOnly = totalEmployerSocial + totalEmployeeSocial;

        // Përditëso rreshtat përkatës në tabelën e Ditari
        $('#ditariGrossSalary').text(totalGrossSalary.toFixed(2));
        $('#ditariEmployerSocial').text(totalSocialOnly.toFixed(2));
        $('#ditariNetSalary').text(totalNetSalary.toFixed(2));
        $('#ditariTAP').text(totalTAP.toFixed(2));
        $('#ditariTotalInsurance').text(totalSocial.toFixed(2));

        // Përllogarit "Diferenca" për balancën në kontabilitet
        const balanceDifference = (totalGrossSalary + totalSocialOnly) - (totalSocial + totalTAP + totalNetSalary);
        $('#ditariDifference').text(balanceDifference.toFixed(2));
    }
