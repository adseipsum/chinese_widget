Adding user instruction
========================

After complete user registration in you system you need register them on platform

### User registration example


            $urlDataJson = [
                "accessPass" => "<platform_admin_hash>",
                "json" => json_encode([
                    "command" => "user_add",
                        "first_name" => "<first_name>",
                        "last_name" => "<last_name>",
                        "email" => "<user_email>",
                        "hash_user" => "<user_hash>",
                        "mobile_phone" => "<user_phone>",
                        "language" => "en",
                        "user_type" => "0",
                        "group_id" => "1", //see BS CD for group_id (default 1- USD, 2-EUR)
                        "active" => "1" // user can trade
                ])
            ];
            
            $ch = curl_init();
	            curl_setopt($ch, CURLOPT_URL, 'http://www.sorosoption.com:8080/');
		        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST" );
		        curl_setopt($ch, CURLOPT_POSTFIELDS, $urlDataJson);  
	            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
	            $response = curl_exec($ch);
	            
	            if($response===false){
	                // processing curl error code
	                echo 'curl error:' . curl_error($c)
	                // ...
	                
	            }else{
	                $result = json_decode($response);
	                if (isset($result->error) && intVal($result->error) !== 0){
	                // processing platform error code
	                // ...
	                }else{
	                    // platform user created write to your database
	                    // platform user_id, account, hash_user, user platform password
	                    $your_model->platform_account =  $result->account;
	                    $your_model->platform_password =  <posted password>;
	                    $your_model->platform_hash =  <posted hash_user>;
	                   // and so on ... 	                                   	                    	                        
	                }
	            }	            
	            curl_close($ch);
	            
	            
Now you have user registered in platform associated with user from your system
For run BS widget from them, you can authenticate user in your system and if it success return widget content(index.html) from php application.

Widget get base configuration, include user platform authentication information from js/config.json.
You need to replace this one to url of your application what wheel return config.json content for authenticated user.

### Widget config example

{
  "js_env": "dev",
  "wss_url": "wss://your_platform_url:your_platformport",
  "language": "en",
  "currency": "$",
  "s_username": "",
  "s_password": "",
  "s_userhash": "platform_user_hash associated with authenticated user",
  "reset_consoles":"false",
  "account_type": "real"
}

Congratulations your win :)