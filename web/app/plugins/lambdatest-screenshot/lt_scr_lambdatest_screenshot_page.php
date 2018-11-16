<?php
    if (!defined('ABSPATH')) {
        exit;
    }
    require_once 'lt_scr_lambdatest_config.php';
    wp_register_style('lt_scr_lambdatest_screenshot_page_css', plugins_url('css/lt_scr_lambdatest_screenshot_page.css', __FILE__), array(), null);
    wp_enqueue_style('lt_scr_lambdatest_screenshot_page_css');
?>
    <div class="main-section" id="lt_src_app">
        <template>
            <div class="_main_container_" @mouseover.once="updateUrl()">
                <div class="col-xs-12 padding-zero native-tab-sec">
                    <div class="col-xs-12 search-sec">
                    <div class="col-xs-5" style="padding: 0px;">
                        <input type="text" class="search-input" name="txtUrl" value="" v-model="txtUrl" @keyup="getAutoSuggestion()">
                    <ul class="search-list-view display_none">
                        <li v-for="(page,index) in lt_src_pages" :key="index" :class="{ isDisable: page.lt_scr_is_disable === '0'}" class="lt_scr_my_page" @click="choosePage(page)">
                            <p class="titel" >{{page.lt_scr_title}} {{ page.lt_scr_is_disable === '0' ? '(Unpublished)' :''}}</p>
                            <p class="discri">{{page.lt_scr_page_link}}</p>
                        </li>
                    </ul>
                    </div>
                    <div class="col-xs-2">
                        <button type="button" class="btn btn-warning start-btn" @click="postScreenShot()">
                            <img class="svg" width="20" height="20" src="<?php echo plugins_url( 'icons/rocket.svg', __FILE__ ); ?>" >
                            START
                        </button>
                    </div>

                    </div>
                    <div class="col-xs-8">
                    <div class="col-xs-9">
                        <ul class="tab-device" role="tablist">
                            <li class="active">
                                <a href="#lt_scr_desktop" role="tab" data-toggle="tab">
                                    DESKTOP
                                </a>
                            </li>
                            <li >
                                <a href="#lt_scr_mobile" role="tab" data-toggle="tab">
                                    MOBILE
                                </a>
                            </li>
                            <li>
                                <img class="cursor-pointer" @click="clearConfig()" width="20" src="<?php echo plugins_url( 'icons/reset.png', __FILE__ ); ?>"> &nbsp; <span v-text="total_count"></span>/25 Selected
                            </li>
                            <li >
                                <div class="cursor-pointer" style="font-size: 20px;" width="20"  id="preference_setting"><i class="glyphicon glyphicon-cog" style="margin-top: -9px;position: absolute;"></i></div>
                                <div class="setting-price" style="min-width: 220px;height: 280px; border: 1px solid #ccc;padding: 10px;">
                                    <div class="popupContent padding30">
                                        <div class="formControl">
                                            <label class="labeltxt">OSX Resolution</label>
                                            <div class="formField">
                                                <select id="mac-res" v-model="mac_res">
                                                    <option v-for="(osx_resolution,index) in preferences.mac_res" :key="index" :value="osx_resolution.resolution_id">
                                                        {{osx_resolution.width}}x{{osx_resolution.height}}
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="clearfix"></div>
                                        </div>
                                        <div class="formControl">
                                            <label class="labeltxt">Windows Resolution</label>
                                            <div class="formField">
                                                <select id="win-res" v-model="win_res">
                                                    <option v-for="(win_resolution,index) in preferences.win_res" :key="index" :value="win_resolution.resolution_id">
                                                        {{win_resolution.width}}x{{win_resolution.height}}
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="clearfix"></div>
                                        </div>
                                        <div class="formControl">
                                            <label class="labeltxt">Defer Time</label>
                                            <div class="formField">
                                                <select id="defer-time" v-model="defer_time">
                                                    <option v-for="(diff_time,index) in differ_time.defer_time" :key="index" :value="diff_time.defer_time">
                                                        {{diff_time.time_display}}
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="clearfix"></div>
                                        </div>
                                        <div class="formControl">
                                            <label class="labeltxt">Mobile Layout</label>
                                            <div class="formField">
                                                <div class="firstfield">
                                                    <input id="portrait" name="sc_layout" value="portrait" type="radio" v-model="layout">
                                                    <label class="vertical-align-top" for="portrait">Portrait</label>
                                                </div>
                                                <input id="landscape" name="sc_layout" value="landscape" type="radio" v-model="layout">
                                                <label class="vertical-align-top" for="landscape">Landscape</label>
                                            </div>
                                            <div class="clearfix"></div>
                                        </div>
                                        <div class="formControl">
                                            <label class="">
                                                <input class="checkDefault" v-model="email" id="send_email" name="completion_alert_email" type="checkbox">Email me on Completion</label>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="col-xs-3">

                    </div>

                    </div>
                </div>

                <div class="col-xs-12 padding-zero config-device">
                    <div class="tab-content">

                        <div role="tabpanel" class="tab-pane active" id="lt_scr_desktop">

                            <div class="col-xs-12">
                                <ul class="browsers-list" id="browsers-list-id" style="padding-left: 15px;">
                                    <li v-for="(browser,index) in desktop.browsers" :key="index" :class="{ active: index === 0 }" v-if="browser.count > 0">
                                        <span class="select-num" :id="browser.browser_id">0</span>
                                        <a :href="getTabRef('#',browser.image)" role="tab" data-toggle="tab">
                                            <img class="gray-icon mCS_img_loaded" :src="getImgUrl('<?php echo plugins_url( 'icons/', __FILE__ ); ?>',browser.image,'-grey','.svg')" :alt="browser.name">
                                            <img class="color-icon mCS_img_loaded" :src="getImgUrl('<?php echo plugins_url( 'icons/', __FILE__ ); ?>',browser.image,'','.svg')" :alt="browser.name">
                                        </a>
                                    </li>
                                </ul>


                            </div>


                            <div class="tab-content desktop_content" >

                                <div v-for="(browser,index) in desktop.browsers" :key="index" v-if="browser.count > 0" role="tabpanel" class="tab-pane" :class="{ active: index === 0 }" :id="getTabRef('',browser.image)">
                                    <div class="col-xs-3 col-md-offset-2 top_15">{{browser.br_name}} Versions</div>
                                    <div class="col-xs-12 browsers-ver-sec" v-for="(desktop_browser,desk_index) in desktop.desktop" :key="desk_index" v-if="desktop_browser.versions[browser.name].length > 0">
                                        <div class="col-xs-2">
                                            <div class="list-os-tab" :id="browser.browser_id+'_'+desktop_browser.os_version_id">{{desktop_browser.name}}</div>
                                        </div>
                                        <div class="col-xs-3" data-mcs-theme="dark">
                                            <ul class="browsers-ver-list">
                                                <li :id="browser.browser_id+'_'+desktop_browser.os_version_id+'_'+desktop_browser_version.browser_version_id" v-for="(desktop_browser_version,desk_ver_index) in desktop_browser.versions[browser.name]" :key="desk_ver_index" @click="setDesktopConf(desktop_browser.os_version_id,desktop_browser_version.browser_id,desktop_browser_version.browser_version_id,desktop_browser.name.includes('Win') ? win_res:mac_res)" :class="desk_ver_index > 10 ? browser.browser_id+'_'+desktop_browser.os_version_id + ' display_none':''">
                                                    {{desktop_browser_version.version_no}}
                                                </li>
                                                <li :id="'more_less_'+browser.browser_id+'_'+desktop_browser.os_version_id" style="color: #05e7e6;cursor: pointer;" :class="{ display_none: desktop_browser.versions[browser.name].length <= 10}" @click="showMore(browser.browser_id+'_'+desktop_browser.os_version_id)">more..</li>
                                            </ul>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>





                        <div role="tabpanel" class="tab-pane" id="lt_scr_mobile">
                            <div class="col-xs-12">

                                <ul class="browsers-list mobile-device" id="browsers-list-id" style="padding-left: 15px;">

                                    <li class="active">
                                        <a href="#androidTab" role="tab" data-toggle="tab">
                                            <img class="gray-icon" src="<?php echo plugins_url( 'icons/android-grey.svg', __FILE__ ); ?>">
                                            <img class="color-icon" src="<?php echo plugins_url( 'icons/android-green.svg', __FILE__ ); ?>">
                                            Android
                                        </a>
                                    </li>

                                    <li>
                                        <a href="#appleTab" role="tab" data-toggle="tab">
                                            <img class="gray-icon mCS_img_loaded" src="<?php echo plugins_url( 'icons/apple-grey.svg', __FILE__ ); ?>">
                                            <img class="color-icon mCS_img_loaded" src="<?php echo plugins_url( 'icons/apple-dark.svg', __FILE__ ); ?>">
                                            Apple
                                        </a>
                                    </li>

                                </ul>

                            </div>

                            <div class="tab-content">

                                <div role="tabpanel" class="tab-pane active" id="androidTab">
                                    <div class="col-xs-12 browsers-ver-sec" v-for="(mobile_ele,index) in mobile.android" :key="index">
                                        <div class="col-xs-2">
                                            <div class="list-os-tab" :id="mobile_ele.manufacturer_id">{{mobile_ele.name}}</div>
                                        </div>
                                        <div class="col-xs-3"  data-mcs-theme="dark">
                                            <ul class="version-list">
                                                <li class="" v-for="(device,device_index) in mobile_ele.devices" :key="device_index" :id="mobile_ele.manufacturer_id+'_'+device.device_id+'_'+device.os_version_id+'_'+device.resolution_id" @click="setMobileConf('android',mobile_ele.manufacturer_id,device.device_id,device.os_version_id,device.resolution_id)" :class="device_index > 4 ?  mobile_ele.manufacturer_id + ' display_none':''">
                                                    {{device.name}}
                                                </li>
                                                <li :id="'more_less_'+mobile_ele.manufacturer_id" style="color: #05e7e6;cursor: pointer;" :class="{ display_none: mobile_ele.devices.length <= 5}" @click="showMore(mobile_ele.manufacturer_id)">more..</li>
                                            </ul>
                                        </div>
                                    </div>

                                </div>


                                <div role="tabpanel" class="tab-pane" id="appleTab">

                                    <div class="col-xs-12 browsers-ver-sec" v-for="(mobile_ele,index) in mobile.ios" :key="index">
                                        <div class="col-xs-2">
                                            <div class="list-os-tab" :id="mobile_ele.os_version_id">{{mobile_ele.name}}</div>
                                        </div>
                                        <div class="col-xs-3"  data-mcs-theme="dark">
                                            <ul class="version-list">
                                                <li class="" v-for="(device,device_index) in mobile_ele.devices" :key="device_index" :id="'_'+device.device_id+'_'+mobile_ele.os_version_id+'_'+device.resolution_id" @click="setMobileConf('ios','',device.device_id,mobile_ele.os_version_id,device.resolution_id)" :class="device_index > 4 ?  mobile_ele.os_version_id + ' display_none':''">
                                                    {{device.name}}
                                                </li>
                                                <li :id="'more_less_'+mobile_ele.os_version_id" style="color: #05e7e6;cursor: pointer;" :class="{ display_none: mobile_ele.devices.length <= 5}" @click="showMore(mobile_ele.os_version_id)">more..</li>
                                            </ul>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </div>
            <div class="main_loader" :class="{ display_none: main_loader_is_active === false}">
                <img src="<?php echo plugins_url( 'icons/loading_img.gif', __FILE__ ); ?>">
            </div>
        </template>
    </div>

<?php
    function lt_scr_lambdatest_screenshot_page_script($lt_falcon_url,$lt_lums_url){
        ?>
            <script>
                jQuery(function() {
                    if(localStorage.getItem('lt_scr_current_url')){
                        jQuery(`.search-input`).val(localStorage.getItem('lt_scr_current_url'));
                    }
                    jQuery(window).resize(function(){
						if(jQuery(window).width() < 800){
							jQuery('body').css('overflow-x','inherit');
						}
					});
					jQuery("#preference_setting,.Apply").click(function(){
						jQuery(".setting-price").toggle("up");
					});

                });
                var lt_src_app = new Vue({
                    el: '#lt_src_app',
                    data: {
                        main_loader_is_active:false,
                        configs:[],
                        lt_src_pages:[],
                        txtUrl:"",
                        total_count:0,
                        desktop: {

                        },
                        mobile:{

                        },
                        preferences:{

                        },
                        differ_time:{

                        },
                        layout:"portrait",
                        compressed:false,
                        email:true,
                        defer_time:2,
                        win_res:"RES100021498719908608",
                        mac_res:"RES100021498719908608"
                    },
                    created(){
                        this.getDesktop();
                        this.getMobile();
                        this.getPreferences();
                        this.getDifferTime();
                        this.getPages();
                    },
                    methods: {
                        getPages:function(){
                            let lt_src_pages_posts = [];
                            <?php

                                $pages = get_pages(
                                    array(
                                        'sort_order' => 'asc',
                                        'sort_column' => 'post_title',
                                        'post_type' => 'page',
                                        'post_status' => 'publish,private,draft',
                                    )
                                );

                                $posts = get_posts(
                                    array(
                                        'sort_order' => 'asc',
                                        'sort_column' => 'post_title',
                                        'post_type' => 'post',
                                        'post_status' => 'publish,private,draft',
                                    )
                                );
                                $page_post = array_merge($posts,$pages);

                                foreach ( $page_post as $page ) {
                                    ?>
                                    lt_src_pages_posts.push({
                                        lt_scr_title:"<?php echo $page->post_title;?>",
                                        lt_scr_page_link:"<?php echo get_page_link( $page->ID );?>",
                                        lt_scr_is_disable:"<?php echo $page->post_status === "publish" ? '1' : '0'; ?>"
                                    });
                                    <?php
                                }
                            ?>
                            this.lt_src_pages = lt_src_pages_posts;
                        },
                        getDesktop : function(){
                            axios.get(`<?php echo plugins_url( 'launchers/screenshot-desktop.json', __FILE__ ); ?>`)
                            .then(function (response) {
                                this.desktop = response.data;
                            }.bind(this))
                            .catch(function (error) {
                                console.log(`${error.message}`);
                            }.bind(this));
                        },
                        getMobile : function(){
                            axios.get(`<?php echo plugins_url( 'launchers/screenshot-mobile.json', __FILE__ ); ?>`)
                            .then(function (response) {
                                this.mobile = response.data;
                            }.bind(this))
                            .catch(function (error) {
                                console.log(`${error.message}`);
                            }.bind(this));
                        },
                        getPreferences : function(){
                            axios.get(`<?php echo plugins_url( 'sample-json/preferences.json', __FILE__ ); ?>`)
                            .then(function (response) {
                                this.preferences = response.data;
                            }.bind(this))
                            .catch(function (error) {
                                console.log(`${error.message}`);
                            }.bind(this));
                        },
                        getDifferTime : function(){
                            axios.get(`<?php echo plugins_url( 'sample-json/screenshot-preferences.json', __FILE__ ); ?>`)
                            .then(function (response) {
                                this.differ_time = response.data;
                            }.bind(this))
                            .catch(function (error) {
                                console.log(`${error.message}`);
                            }.bind(this));
                        },
                        getAutoSuggestion:function(){
                            let urlVal = this.txtUrl ? this.txtUrl.toLowerCase():"";
                            if(urlVal){
                                jQuery(`.search-list-view`).removeClass('display_none');
                                jQuery(`.lt_scr_my_page`).each(function(){
                                    if(jQuery(this).find('p').first().text().toLowerCase().includes(`${urlVal}`)){
                                        jQuery(this).removeClass('display_none');
                                    } else{
                                        jQuery(this).addClass('display_none')
                                    }
                                })
                                if(this.lt_src_pages.length === jQuery(`.lt_scr_my_page.display_none`).length){
                                    jQuery(`.search-list-view`).addClass('display_none');
                                }
                            } else{
                                jQuery(`.search-list-view`).addClass('display_none');
                            }
                        },
                        getImgUrl:function (base,browser,color,type) {
                            let images = base + browser + (color ? (color + type):type) ;
                            return images;
                        },
                        getTabRef:function (hash,name) {
                            return hash ? (hash + name):name;
                        },
                        setDesktopConf:function(os_version_id,browser_id,browser_version_id,resolution_id){
                            let deviceIndex = this.configs.findIndex(device => {
                                    return (
                                        device.type === "desktop" &&
                                        device.os_version_id === os_version_id &&
                                        device.browser_id === browser_id &&
                                        device.browser_version_id === browser_version_id &&
                                        device.resolution_id === resolution_id
                                    )
                                });
                            if(deviceIndex > -1){
                                this.configs.splice(deviceIndex, 1);
                                jQuery(`#${browser_id}_${os_version_id}_${browser_version_id}`).removeClass('active lt_scr_custom_active');
                            } else{
                                if(this.configs.length >= 25){
                                    alert("You Selection going to exceeded maximum limit. Please unselect one then Select");
                                } else{
                                    this.configs.push({
                                        type:"desktop",
                                        os_version_id:os_version_id,
                                        browser_id:browser_id,
                                        browser_version_id:browser_version_id,
                                        resolution_id:resolution_id
                                    })
                                    jQuery(`#${browser_id}_${os_version_id}_${browser_version_id}`).addClass('active lt_scr_custom_active');
                                }
                            }

                            this.getBrowserCount();
                            this.isDesktopActive();
                        },
                        setMobileConf:function(type,manufacturer_id,device_id,os_version_id,resolution_id){
                            let deviceIndex = this.configs.findIndex(device => {
                                    return (
                                        device.type === type &&
                                        manufacturer_id === manufacturer_id &&
                                        device.device_id === device_id &&
                                        device.os_version_id === os_version_id &&
                                        device.resolution_id === resolution_id
                                    )
                                });
                            if(deviceIndex > -1){
                                this.configs.splice(deviceIndex, 1);
                                jQuery(`#${manufacturer_id}_${device_id}_${os_version_id}_${resolution_id}`).removeClass('active lt_scr_custom_active');
                            } else{
                                if(this.configs.length >= 25){
                                    alert("You Selection going to exceeded maximum limit. Please unselect one then Select");
                                } else{
                                    this.configs.push({
                                        type:type,
                                        manufacturer_id:manufacturer_id,
                                        device_id:device_id,
                                        os_version_id:os_version_id,
                                        resolution_id:resolution_id
                                    })
                                    jQuery(`#${manufacturer_id}_${device_id}_${os_version_id}_${resolution_id}`).addClass('active lt_scr_custom_active');

                                }
                            }
                            this.getBrowserCount();
                            this.isMobileActive();
                        },
                        isDesktopActive:function(){
                            this.desktop.browsers.forEach(browser => {
                                this.desktop.desktop.forEach(element => {
                                    let deviceIndex = this.configs.findIndex(device => {
                                        return (
                                            device.type === "desktop" &&
                                            device.browser_id === browser.browser_id &&
                                            device.os_version_id === element.os_version_id
                                        )
                                    });
                                    if(deviceIndex > -1){
                                        jQuery(`#${browser.browser_id}_${element.os_version_id}`).addClass('active lt_scr_custom_active');
                                    } else{
                                        jQuery(`#${browser.browser_id}_${element.os_version_id}`).removeClass('active lt_scr_custom_active');
                                    }
                                });
                            });
                        },
                        isMobileActive:function(){
                            let androidConf = this.configs.filter(function (el) {
                                return el.type === "android";
                            });

                            let iosConf = this.configs.filter(function (el) {
                                return el.type === "ios";
                            });
                            this.mobile.android.forEach(mob_element => {
                                let deviceIndex = androidConf.findIndex(device => {
                                    return (
                                        device.manufacturer_id === mob_element.manufacturer_id
                                    )

                                });
                                if(deviceIndex > -1){
                                    jQuery(`#${mob_element.manufacturer_id}`).addClass('active lt_scr_custom_active');
                                } else{
                                    jQuery(`#${mob_element.manufacturer_id}`).removeClass('active lt_scr_custom_active');
                                }
                            });

                            this.mobile.ios.forEach(mob_element => {
                                let deviceIndex = iosConf.findIndex(device => {
                                    return (
                                        device.os_version_id === mob_element.os_version_id
                                    )

                                });
                                if(deviceIndex > -1){
                                    jQuery(`#${mob_element.os_version_id}`).addClass('active lt_scr_custom_active');
                                } else{
                                    jQuery(`#${mob_element.os_version_id}`).removeClass('active lt_scr_custom_active');
                                }
                            });
                        },
                        getBrowserCount:function(){
                            this.desktop.browsers.forEach(element => {
                                jQuery(`#${element.browser_id}`).text(this.configs.filter(function(value) { return value.browser_id === element.browser_id }).length);
                            });
                            this.total_count = this.configs.length;
                        },
                        clearConfig:function(){
                            this.configs = [];
                            this.getBrowserCount();
                            jQuery(`.lt_scr_custom_active`).removeClass('active');
                        },
                        postScreenShot:function(){
                            if(this.configs.length <= 0){
                                alert(`Please select atleast one device`);
                            } else{
                                this.main_loader_is_active = true;
                                this.verifyToken();
                            }
                        },
                        verifyToken:function(){
                            if(localStorage.getItem('lt_scr_access_token') && localStorage.getItem('lt_scr_organization_id')){
                                this.sendScreenshot(localStorage.getItem('lt_scr_organization_id'),true);
                            } else{
                                <?php
                                    global $wpdb;
                                    $table_name = $wpdb->prefix . 'lt_src_lambdatest';
                                    $row_1_sql = "SELECT * FROM " . $table_name . " WHERE id = 1";
                                    $cur_user = $wpdb->get_row($row_1_sql);
                                    if (isset($cur_user) && isset($cur_user->email) && is_email(sanitize_email(trim($cur_user->email))) && isset($cur_user->token) && sanitize_text_field(trim($cur_user->token))) {?>
                                        axios.post('<?php echo $lt_lums_url;?>/api/user/auth/WordPress', {
                                            email: "<?php echo sanitize_email(trim($cur_user->email)); ?>",
                                            token: "<?php echo sanitize_text_field(trim($cur_user->token)); ?>"
                                        }).then(function (response) {
                                            let authData = response.data;
                                            if(authData.type === 'success'){
                                                localStorage.setItem('lt_scr_access_token',authData.token);
                                                localStorage.setItem('lt_scr_organization_id',authData.user.organization_id);
                                                this.sendScreenshot(authData.user.organization_id,false);
                                            }
                                        }.bind(this))
                                        .catch(function (error) {
                                            this.main_loader_is_active = false;
                                            if(error.response && error.response.status === 401){
                                                alert(`Please activate LambdaTest Screenshot plugin by entering Access Token. Click Here to know how`);
                                                window.location="<?php echo admin_url(); ?>admin.php?page=lt_scr_lambdatest_home_page";
                                            }
                                        }.bind(this));
                                    <?php } else {?>
                                        this.main_loader_is_active = false;
                                        alert(`Please activate LambdaTest Screenshot plugin by entering Access Token. Click Here to know how`);
                                        window.location="<?php echo admin_url(); ?>admin.php?page=lt_scr_lambdatest_home_page";
                                    <?php }?>
                            }
                        },
                        reVerifyToken:function(){
                            <?php
                                global $wpdb;
                                $table_name = $wpdb->prefix . 'lt_src_lambdatest';
                                $row_1_sql = "SELECT * FROM " . $table_name . " WHERE id = 1";
                                $cur_user = $wpdb->get_row($row_1_sql);

                                if (isset($cur_user) && isset($cur_user->email) && is_email(sanitize_email(trim($cur_user->email))) && isset($cur_user->token) && sanitize_text_field(trim($cur_user->token))) {?>
                                    axios.post('<?php echo $lt_lums_url;?>/api/user/auth/WordPress', {
                                        email: "<?php echo sanitize_email(trim($cur_user->email)); ?>",
                                        token: "<?php echo sanitize_text_field(trim($cur_user->token)); ?>"
                                    }).then(function (response) {
                                        let authData = response.data;
                                        if(authData.type === 'success'){
                                            localStorage.setItem('lt_scr_access_token',authData.token);
                                            localStorage.setItem('lt_scr_organization_id',authData.user.organization_id);
                                            this.sendScreenshot(authData.user.organization_id,false);
                                        }
                                    }.bind(this))
                                    .catch(function (error) {
                                        this.main_loader_is_active = false;
                                        if(error.response && error.response.status === 401){
                                            alert(`Please activate LambdaTest Screenshot plugin by entering Access Token. Click Here to know how`);
                                            window.location="<?php echo admin_url(); ?>admin.php?page=lt_scr_lambdatest_home_page";
                                        }
                                    }.bind(this));
                            <?php } else {?>
                                this.main_loader_is_active = false;
                                alert(`Please activate LambdaTest Screenshot plugin by entering Access Token. Click Here to know how`);
                                window.location="<?php echo admin_url(); ?>admin.php?page=lt_scr_lambdatest_home_page";
                            <?php }?>
                        },
                        sendScreenshot:function(org_id,is_local_storage){
                            if(org_id != null){
                                if (!this.myDefaultConf.url.startsWith('http')) {
                                    this.myDefaultConf.url = 'http://' + this.myDefaultConf.url;
                                }
                                if(this.myDefaultConf.url){
                                    this.myDefaultConf.url = this.myDefaultConf.url.trim().toLowerCase();
                                }
                                if(this.isUrlValid(this.myDefaultConf.url)){
                                    this.myDefaultConf.org_id = org_id;
                                    this.configs.forEach(element => {
                                        delete element.manufacturer_id;
                                    });
                                    axios.post('<?php echo $lt_falcon_url;?>/tests', this.myDefaultConf,{
                                        headers: {
                                            "Content-type": "application/json",
                                            "Authorization":`Bearer ${localStorage.getItem('lt_scr_access_token')}`
                                        }
                                    }).then(function (response) {
                                        let test_id = response.data.test_id;
                                        if(test_id){
                                            this.main_loader_is_active = false;
                                            window.location=`<?php echo admin_url(); ?>admin.php?page=lt_scr_lambdatest_test_logs&test_id=${test_id}&url=${this.myDefaultConf.url}`;
                                        }
                                    }.bind(this))
                                    .catch(function (error) {
                                        this.main_loader_is_active = false;
                                        if(error.response && error.response.status === 402){
                                            alert("Uh Ohhhh....!!! Looks like you have exhausted your free screenshot sessions for this month. Upgrade your plan to get Unlimited Screenshots");
                                            window.location="<?php echo admin_url(); ?>admin.php?page=lt_scr_lambdatest_home_page";
                                        }
                                        if(is_local_storage === true){
                                            this.reVerifyToken();
                                        } else{
                                            alert(`Please activate LambdaTest Screenshot plugin by entering Access Token. Click Here to know how`);
                                            window.location="<?php echo admin_url(); ?>admin.php?page=lt_scr_lambdatest_home_page";
                                        }
                                    }.bind(this));
                                } else{
                                    this.main_loader_is_active = false;
                                    alert("Please enter valid URL");
                                }
                            } else{
                                this.main_loader_is_active = false;
                                alert("Please contact to support");
                            }
                        },
                        isUrlValid:function(userInput) {
                            const regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
                            const regexp1 = /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/
                            if (regexp.test(userInput)) {
                                return true;
                            }else if (regexp1.test(userInput)) {
                                return true;
                            }else if (userInput.indexOf('localhost') >= 0) {
                                return true
                            }else {
                                return false;
                            }
                        },
                        choosePage:function(page){
                            if(page.lt_scr_is_disable === "0"){
                                alert("Please publish this page.")
                            } else{
                                this.txtUrl = page.lt_scr_page_link;
                                jQuery(`.search-list-view`).addClass('display_none');
                            }
                        },
                        showMore:function(ele){
                            if(jQuery(`#more_less_${ele}`).text().includes('more')){
                                jQuery(`.${ele}`).removeClass('display_none');
                                jQuery(`#more_less_${ele}`).text('less..');
                            } else{
                                jQuery(`.${ele}`).addClass('display_none');
                                jQuery(`#more_less_${ele}`).text('more..');
                            }
                        },
                        updateUrl:function(){
                            this.txtUrl = localStorage.getItem('lt_scr_current_url') ? localStorage.getItem('lt_scr_current_url'):"";
                            localStorage.setItem('lt_scr_current_url','');
                        }
                    },
                    computed: {
                        myDefaultConf(){
                            return {
                                configs: this.configs,
                                test_type_id: "Screenshot",
                                layout: this.layout,
                                defer_time:this.defer_time,
                                url: this.txtUrl,
                                email: this.email,
                                compressed: this.compressed,
                                win_res: this.win_res,
                                mac_res: this.mac_res,
                                org_id: "",
                                client:"WordPress"
                            };
                        }
                    }
                })
            </script>
        <?php
    }
    lt_scr_lambdatest_screenshot_page_script($lt_falcon_url,$lt_lums_url);
?>
