<?php
ini_set('display_errors','1');
error_reporting(E_ALL);
require '../sys/config.php';
require '../sys/pdo_fun_calss.php';
require '../sys/function.php';

if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $pdo=new PDO_fun;

    switch ($_POST['type']) {

        //-- 工程進度登入 --
        case 'progress':
            $case=$pdo->select("SELECT COUNT(*) as total FROM appCase WHERE Tb_index=:Tb_index AND ca_pwd=:ca_pwd", ['Tb_index'=>$_POST['Tb_index'], 'ca_pwd'=>$_POST['ca_pwd']], 'one');
            if(!empty($case['total'])){
                echo json_encode(['success'=>true, 'key'=>aes_encrypt(AES_KEY, $_POST['Tb_index'])]);
            }
            else{
                echo json_encode(['success'=>false, 'msg'=>'密碼錯誤!']); 
            }
            break;

        //-- 工程進度資料 --
        case 'progress_data':
            $Tb_index=aes_decrypt(AES_KEY, $_POST['key']);
            $case=$pdo->select("SELECT ca_name FROM appCase WHERE Tb_index=:Tb_index ", ['Tb_index'=>$Tb_index], 'one');
            $case_progress=$pdo->select("SELECT aPic, aPic_txt, StartDate, update_num FROM appCase_process WHERE case_id=:case_id AND OnLineOrNot=1 ORDER BY StartDate DESC, rowid DESC",
                                        ['case_id'=>$Tb_index]);
            if(!empty($case['ca_name'])){
                $case['progress']=$case_progress;
                echo json_encode(['success'=>true, 'data'=>$case]);
            }
            else{
                echo json_encode(['success'=>false, 'msg'=>'請重新登入!']);
            }
            break;

        default:
            # code...
            break;
    }

    $pdo->close();
}
?>