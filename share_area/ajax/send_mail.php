<?php
// ini_set('display_errors','1');
// error_reporting(E_ALL);
require '../sys/config.php';
require '../sys/pdo_fun_calss.php';
require '../sys/function.php';
if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $pdo=new PDO_fun;

    switch ($_POST['type']) {

        //-- 建案預約賞屋 --
        case 'case_mail':

            //-- GOOGLE recaptcha 驗證程式 --
            GOOGLE_recaptcha('6Le-hSUTAAAAAKpUuKnGOoHpKhgq60V1irZPA_4E', $_POST['g-recaptcha-response'], 'back');
            
            $company=$pdo->select("SELECT * FROM company_base LIMIT 0,1", 'no', 'one');
            $body_data='<table border="1" cellpadding="10" cellspacing="0">
                            <tbody>
                            <tr>
                                <td bgcolor="#dadada">姓名：</td>
                                <td>'.$_POST['aName'].'</td>
                            </tr>
                            <tr>
                                <td bgcolor="#dadada">電話：</td>
                                <td>'.$_POST['aPhone'].'</td>
                            </tr>
                            <tr>
                                <td bgcolor="#dadada">信箱：</td>
                                <td>'.$_POST['aEmail'].'</td>
                            </tr>
                            <tr>
                                <td bgcolor="#dadada">內容：</td>
                                <td>'.nl2br( $_POST['aMsg']).'</td>
                            </tr>
                            </tbody>
                        </table>';

            $name_data=[];
            $adds_data=[];
            $case_email_arr=explode(',', $company['case_email']);
            foreach ($case_email_arr as $case_email) {
                array_push($name_data, $company['name']);
                array_push($adds_data, $case_email);
            }
            
            $send_msg=send_Mail($company['name'].'系統', MAILL_USER, $_POST['ca_name'].'-官網預約賞屋', $body_data, $name_data, $adds_data);
            $send_msg['msg']='感謝您的來信，我們將盡快回覆';

            $param=[
                'case_id'=>$_POST['Tb_index'],
                'aName'=>$_POST['aName'],
                'aPhone'=>$_POST['aPhone'],
                'aEmail'=>$_POST['aEmail'],
                'aMsg'=>$_POST['aMsg'],
                'StartDate'=>date('Y-m-d H:i:s')
            ];
            $pdo->insert('appCase_msg', $param);

            echo json_encode($send_msg);
            break;


            //-- 聯絡我們 --
            case 'contact_us':

                //-- GOOGLE recaptcha 驗證程式 --
 	            GOOGLE_recaptcha('6Le-hSUTAAAAAKpUuKnGOoHpKhgq60V1irZPA_4E', $_POST['g-recaptcha-response'], 'back');

                $company=$pdo->select("SELECT * FROM company_base LIMIT 0,1", 'no', 'one');
                $body_data='<table border="1" cellpadding="10" cellspacing="0">
                                <tbody>
                                <tr>
                                    <td bgcolor="#dadada">姓名：</td>
                                    <td>'.$_POST['UserName'].'</td>
                                </tr>
                                <tr>
                                    <td bgcolor="#dadada">電話：</td>
                                    <td>'.$_POST['UserPhone'].'</td>
                                </tr>
                                <tr>
                                    <td bgcolor="#dadada">信箱：</td>
                                    <td>'.$_POST['UserMail'].'</td>
                                </tr>
                                <tr>
                                    <td bgcolor="#dadada">內容：</td>
                                    <td>'.nl2br( $_POST['UserMsg']).'</td>
                                </tr>
                                </tbody>
                            </table>';

                $name_data=[];
                $adds_data=[];
                $case_email_arr=explode(',', $company['email']);
                foreach ($case_email_arr as $case_email) {
                    array_push($name_data, $company['name']);
                    array_push($adds_data, $case_email);
                }

                $send_msg=send_Mail($company['name'].'系統', MAILL_USER, $company['name'].'-聯絡我們來信', $body_data, $name_data, $adds_data);
                $send_msg['msg']='感謝您的來信，我們將盡快回覆';

                $param=[
                    'Tb_index'=>'msg'.date('YmdHis').rand(10,99),
                    'UserName'=>$_POST['UserName'],
                    'UserPhone'=>$_POST['UserPhone'],
                    'UserMail'=>$_POST['UserMail'],
                    'UserMsg'=>$_POST['UserMsg'],
                    'StartDate'=>date('Y-m-d H:i:s')
                ];
                $pdo->insert('appContacts', $param);

                echo json_encode($send_msg);
            break;
        
        default:
            echo json_encode(['success'=>false, 'msg'=>'錯誤的請求']);
            break;
    }

    
    $pdo->close();
}
?>