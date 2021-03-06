var idChk = false;
var mailChk = false;

//ONLOAD
$(function () {
	//DatePicker
	$('input[name=datePicker]').datepicker({
		format: "yyyy-mm-dd", //데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
		autoclose: true //사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
	}).val(new Date().toISOString().slice(0, 10)); //datepicker end
});

// //TAB CHANGE EVENT
$('#tab1,#tab2').on('click',function(){
	idChk=false;
	mailChk=false;
	var id=$(this).attr('id')
	
	if(id=='tab2'){
		$('#btnInit1').trigger('click',[false]);//trigger 2
		location.hash == "#tab2";
	}else if(id=='tab1'){
		$('#btnInit2').trigger('click',[false]);//trigger 2
		$('#tab1').show();
	}
	//$('#btnInit1').bind('click',function(){})//trigger 1
	
})

//jobTypeDetail init
$('#cJobType').on('change', function () {
	$.ajax({
		type: "POST",
		url: "/signup/jobTypeDetail",
		data: {
			"jobType": $("#cJobType option:selected").val()
		},
		async: false,
		dataType: "json",
		success: function (result) {
			//kind
			$('#cJobTypeDetail').empty();
			var listHtml;

			if (result['JsonParam'].jobTypeDetail.length != 0) {
				listHtml += '<option value="0">Please Select</option>';

				$.each(result['JsonParam'].jobTypeDetail, function (index, value) {
					listHtml += '<option value="' + value.CODE_IDX + '">' + value.CODE_NAME + '</option>';
				});

			} else {
				listHtml += '<option value="0">Please Select</option>';
			}

			$('#cJobTypeDetail').append(listHtml);
			//console.log(result['post'][0].ITEM_CD);//JS에서 객체의 멤버변수를 접근할때는 .을 사용
		},
		error: function (request, status, error) {
			//console.log("code:"+request.status+ ", message: "+request.responseText+", error:"+error);
			swal("Error!", "--- Please Contact Administrator ---", "error");
		}
	});
});

//ID CHECK
$('#btnIdCheck1,#btnIdCheck2').on('click', function () {
	var id = $(this).attr('data-memo');
	
	//ID NULL CHECK
	if($("#" + id).val()==""||$("#" + id).val()==null){
		swal("** Please Check **", "Sorry!! Please Input the ID.");
		return;
	}

	$.ajax({
		type: "POST",
		url: "/signup/idCheck",
		data: {
			"id": $("#" + id).val()
		},
		async: false,
		dataType: "json",
		success: function (result) {
			var loginChk = result['JsonParam'].loginChk;

			if (loginChk != 1) {
				swal("Thanks!", "Successfully Checked!\n ID input field would be disabled", "success");
				//$('#'+id).css('background-color', '#e2e2e2');
				$('#' + id).attr("disabled", true);
				$('#' + id).attr("readonly", true);
				idChk = true;
			} else {
				swal("Check!", "The ID that already exists.", "info");
				//$('#'+id).css('background-color', '#e2e2e2');
				$('#' + id).attr("disabled", false);
				$('#' + id).attr("readonly", false);
				idChk = false;
			}
		},
		error: function (request, status, error) {
			//console.log("code:"+request.status+ ", message: "+request.responseText+", error:"+error);
			swal("Error!", "--- Please Contact Administrator ---", "error");
		}
	});
})

//EMAIL CHECK
$('#btnMailCheck1,#btnMailCheck2').on('click', function () {
	var mail = $(this).attr('data-memo');

	//MAIL NULL CHECK
	if($("#" + mail).val()==""||$("#" + mail).val()==null){
		swal("** Please Check **", "Sorry!! Please Input the MAIL.");
		return;
	}

	$.ajax({
		type: "POST",
		url: "/signup/mailCheck",
		data: {
			"mail": $("#" + mail).val()
		},
		async: false,
		dataType: "json",
		success: function (result) {
			var loginChk = result['JsonParam'].loginChk;

			if (loginChk != 1) {
				swal("Thanks!", "Successfully Checked!\n EMAIL input field would be disabled", "success");
				//$('#'+id).css('background-color', '#e2e2e2');
				$('#' + mail).attr("disabled", true);
				$('#' + mail).attr("readonly", true);
				mailChk = true;
			} else {
				swal("Check!", "The EMAIL that already exists.", "info");
				//$('#'+id).css('background-color', '#e2e2e2');
				$('#' + mail).attr("disabled", false);
				$('#' + mail).attr("readonly", false);
				mailChk = false;
			}
		},
		error: function (request, status, error) {
			//console.log("code:"+request.status+ ", message: "+request.responseText+", error:"+error);
			swal("Error!", "--- Please Contact Administrator ---", "error");
		}
	});
})

//validation Check
function validationChk(arrCol,arrVal) {
	var chk = true;
	var i = 0;
	var output = "";

	//ID & EMAIL DUPLICATION CHECK 
	if(idChk==false||mailChk==false){
		if(idChk==false){
			output += 'Confirm ID duplication\n';
		}
		if(mailChk==false){
			output += 'Confirm EMAIL duplication';
		}
		swal("** Please Check **", output);
		return;
	}

	//PASSWORD CHECK
	if(arrVal.PASSWORD!=arrVal.CONFIRM_PASSWORD){
		swal("** Please Check **", "Sorry!! Please Check the Password.");
		return;
	}

	$.each(arrVal, function (index, item) {
		//NULL CHECK
		if (index != "JOB_TYPE" && index != "JOB_TYPE_DETAIL") {
			if (item == "") {
				//$("#idNm").focus(); 
				output += arrCol[i];
				chk = false;
			}
		} else {
			//COMBOBOX CHECK
			if (item == 0) {
				output += arrCol[i];
				chk = false;
			}
		}
		i++
	});

	//에러메세지 출력
	if (output != "") {
		swal("** Please Check input Value **", output);
	}

	return chk;
}

//Save1,2 , Init1,2
$('#btnSave1,#btnSave2,#btnInit1,#btnInit2').click(function (e,flag=true) {
	var msg = 'ID : ' + $('#'+$(this).attr('data-memo')).val();
	var btnId=$(this).attr('id');

	//TAB PAGE 1 PARAMETER COLUMN
	var arrCol1 = [
		'[ ID ]\n',
		'[ PASSWORD ]\n',
		'[ CONFIRM PASSWORD ]\n',
		'[ NAME ]\n',
		'[ EMAIL ]\n',
		'[ PHONE ]\n',
		'[ BIRTH DATE ]\n',
		'[ SEX ]\n',
		'[ ADDRESS ]\n',
		'[ JOB TYPE ]\n',
		'[ JOB TYPE DETAIL ]\n',
		'[ CANDIDATE IMAGE ]\n',
		'[ SELF INTRODUCTION ]'
	];

	//TAB PAGE 1 PARAMETER ROW
	var arrVal1 = {
		ID: $('#cId').val(),
		PASSWORD: $('#cPass').val(),
		CONFIRM_PASSWORD: $('#cConfirmPass').val(),
		NAME: $('#cName').val(),
		EMAIL: $('#cMail').val(),
		PHONE: $('#cPhone').val(),
		BIRTH_DATE: $('#cBirth').val(),
		SEX: $('input[name=rdoSex]:checked').val(),
		ADDRESS: $('#cAdress').val(),
		JOB_TYPE: $('#cJobType option:selected').val(),
		JOB_TYPE_DETAIL: $('#cJobTypeDetail option:selected').val(),
		CANDIDATE_IMAGE: $('#cPath').val(),
		SELF_INTRODUCTION: $('#cIntro').val()
	}

		//TAB PAGE 2 PARAMETER COLUMN
		var arrCol2 = [
			'[ ID ]\n',
			'[ PASSWORD ]\n',
			'[ CONFIRM PASSWORD ]\n',
			'[ EMPLOYER NAME ]\n',
			'[ EMPLOYER INTRODUCTION ]\n',
			'[ EMPLOYER IMAGE ]\n',
			'[ COMPANY NAME ]\n',
			'[ COMPANY EMAIL ]\n',
			'[ COMPANY TELEPHONE NUMBER ]\n',
			'[ COMPANY ESTABLISHMENT DATE ]\n',
			'[ COMPANY ADDRESS ]\n',
			'[ JOB TYPE ]\n',
			'[ COMPANY IMAGE ]\n',
			'[ COMPANY INTRODUCTION ]'
		];
	
		//TAB PAGE 2 PARAMETER ROW
		var arrVal2 = {
			ID: $('#eId').val(),
			PASSWORD: $('#ePass').val(),
			CONFIRM_PASSWORD: $('#eConfirmPass').val(),
			EMPLOYER_NAME: $('#eName').val(),
			EMPLOYER_INTRODUCTION: $('#eIntro').val(),
			EMPLOYER_IMAGE: $('#ePath').val(),
			COMPANY_NAME: $('#comName').val(),
			COMPANY_EMAIL: $('#comMail').val(),
			COMPANY_TELEPHONE_NUMBER: $('#comPhone').val(),
			COMPANY_ESTABLISHMENT_DATE: $('#comBirth').val(),
			COMPANY_ADDRESS: $('#comAdress').val(),
			JOB_TYPE: $('#comJobType option:selected').val(),
			COMPANY_IMAGE: $('#comPath').val(),
			COMPANY_INTRODUCTION: $('#comIntro').val()
		}

	switch(btnId){
		//BUTTON SAVE1
		case 'btnSave1':
			if (validationChk(arrCol1,arrVal1)) {
				swal({
					title: "Create Account",
					text: "Would you like to Create " + msg + "?",
					icon: "info",
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					buttons: true
					//dataType: "json",전달받을 데이터양식, 보낼때는 생략
				}).then((willDelete) => {
					if (willDelete) {
						$.ajax({
							type: "PUT",
							url: "/signup/insertCandidate",
							data: {
								"data": JSON.stringify(arrVal1)
							},
							async: false,
							success: function (result) {
								swal("Thanks!", "Successfully Created!", "success");
								location.reload();
							},
							error: function (request, status, error) {
								swal("Error!", "--- Please Contact Administrator ---", "error");
							}
						});
					}
				});
			}
		break;
		//BUTTON SAVE2
		case 'btnSave2':
			if (validationChk(arrCol2,arrVal2)) {
				swal({
					title: "Create Account",
					text: "Would you like to Create " + msg + "?",
					icon: "info",
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					buttons: true
				}).then((willDelete) => {
					if (willDelete) {
						$.ajax({
							type: "PUT",
							url: "/signup/insertEmployer",
							data: {
								"data": JSON.stringify(arrVal2)
							},
							async: false,
							success: function (result) {
								swal("Thanks!", "Successfully Created!", "success");
								location.reload();
							},
							error: function (request, status, error) {
								//console.log("code:"+request.status+ ", message: "+request.responseText+", error:"+error);
								swal("Error!", "--- Please Contact Administrator ---", "error");
							}
						});
					}
				});
			}
		break;
		//BUTTON INIT1
		case 'btnInit1':
			if(flag){
				swal({
					title: "Init Values",
					text: "Would you like to Init Values?",
					icon: "info",
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					buttons: true
				}).then((willDelete) => {
					if (willDelete) {
						idChk = true;
						mailChk = true;
						$('#cId').val('1');
						$('#cPass').val('22');
						$('#cConfirmPass').val('22');
						$('#cName').val('4');
						$('#cMail').val('5');
						$('#cPhone').val('6');
						$('#rdoSex1').attr('checked');//$('input[name=rdoSex]:checked').val()
						$('#cAdress').val('8');
						$('#cJobType option:eq(0)').attr('selected','selected');//$('#cJobType option:selected').val()
						$('#cJobTypeDetail option:eq(0)').attr('selected','selected');
						$('#cPath').val('9');
						$('#cIntro').val('00');
					}
				});
			}else{
					idChk = false;
					mailChk = false;
					$('#cId').val('');
					$('#cPass').val('');
					$('#cConfirmPass').val('');
					$('#cName').val('');
					$('#cMail').val('');
					$('#cPhone').val('');
					//$('#cBirth').val();
					$('#rdoSex1').attr('checked');//$('input[name=rdoSex]:checked').val()
					$('#cAdress').val('');
					$('#cJobType option:eq(0)').attr('selected','selected');//$('#cJobType option:selected').val()
					$('#cJobTypeDetail option:eq(0)').attr('selected','selected');
					$('#cPath').val('');
					$('#cIntro').val('');
			}
		break;
		//BUTTON INIT2
		case 'btnInit2':
			if(flag){
				swal({
					title: "Init Values",
					text: "Would you like to Init Values?",
					icon: "info",
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					buttons: true
				}).then((willDelete) => {
					if (willDelete) {
						idChk = true;
						mailChk = true;

						$('#eId').val('1'),
						$('#ePass').val('22'),
						$('#eConfirmPass').val('22'),
						$('#eName').val('4'),
						$('#eIntro').val('5'),
						$('#ePath').val('6'),
						$('#comName').val('77777'),
						$('#comMail').val('7'),
						$('#comPhone').val('8'),
						$('#comBirth').val('9'),
						$('#comAdress').val('10'),
						$('#comJobType option:eq(1)').attr('selected','selected'),
						$('#comPath').val('11'),
						$('#comIntro').val('12')
					}
				});
			}else{
					idChk = false;
					mailChk = false;
					$('#eId').val(''),
					$('#ePass').val(''),
					$('#eConfirmPass').val(''),
					$('#eName').val(''),
					$('#eIntro').val(''),
					$('#ePath').val(''),
					$('#comName').val(''),
					$('#comMail').val(''),
					$('#comPhone').val(''),
					$('#comBirth').val(''),
					$('#comAdress').val(''),
					$('#comJobType option:eq(0)').attr('selected','selected'),
					$('#comPath').val(''),
					$('#comIntro').val('')
			}
		break;
	}
});