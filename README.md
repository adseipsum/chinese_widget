# Binary Station Trading Console

Binary Station Trading Console (widget) is single page application (SPA) that work with Binary Station Platforms. 
Widget can work with two platforms called real and demo.

## Widget initialization
If you need for widget work with **real** platform you can put **#real** to end of widget url
By default or if you put **#demo** to end of widget url widget should be work with **demo** platform.

**For Example:**
You widget live in https://yourdomain.com/platform 
When you open https://yourdomain.com/platform or https://yourdomain.com/platform#demo widget should be work with **demo** platform.
When you open https://yourdomain.com/platform#real widget should be work with **real** platform.

When widget opening, it get json configuration by ajax call using GET method with **platform_type** query parameter from your site **widget configuration endpoint**.

**platform_type** parameter value is: 
* **`demo`** - then you open https://yourdomain.com/platform or https://yourdomain.com/platform#demo 
* **`real`** - then you open https://yourdomain.com/platform#real

**Widget configuration endpoint** should return valid json that contain:
* **platform WSS Url** - url to real or demo platform
* **widget language** - supported user language, - default 'en' 
* **current user unique md5 hash** - unique user hash that generated on you site side when user registration.
* **balance Url** - optional, if you need to track deposit changes when user work in widget

For build  **widget configuration endpoint** responce you can use BsHttpApi library

**For Example:**
```php
$bsApi = binaryware\BsHttpApi\Api::getInstance($platform_type); // 'real' or 'demo'
$res = $bsApi->getWidgetConfig([
    'hash'=>$current_user->hash, // current user unique md5 hash
    'language'=>$current_user->language, // if not set use 'en',
    'balanceUrl'=>'https://..', // url to post ajax on user deposit updated
]);
if ($res===null){
    throw new \Exception($bsApi->getError());
}else{
    echo json_encode($res);
}
```
For more details see readme for BsHttpApi

If widget receive http error from **widget configuration endpoint** or not valid json it redirect user to **error endpoint url**

##User registration

When user registered on you site you should generate and store **unique md5 user hash**, which will be used later for registration user on platform  and in **widget configuration endpoint**.

At each user logon to the site (after confirming email, etc.), you check whether the user is registered on the platform.
And if it not registered register him.

For register user on platform you can use BsHttpApi.

**For example:**

```php
$bsApi = binaryware\BsHttpApi\Api::getInstance($platform_type);
$res = $bsApi->addUser([
    'email'=>$currentUser->email
    'hash'=>$currentUser->hash,  // unique md5 user hash
]);
if ($res===null){
    throw new \Exception($bsApi->getError());
}else{
    $platform_user_id = $res['user_id'];
    $platform_user_account = $res['account'];
    
    // store $platform_user_id and $platform_user_account to Db for later use
}
```

For check whether the user is registered on the platform you can look at $platform_user_id or $platform_user_account
For more details see readme for BsHttpApi.


## Deposit/Withdrawal

For change user balance on platform you can use BsHttpApi.
For more details see readme for BsHttpApi.
