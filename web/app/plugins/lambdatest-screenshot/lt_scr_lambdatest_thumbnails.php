<?php
    if (!defined('ABSPATH')) {
        exit;
    }
?>
<div class="_thumbnails_container_" v-if="response_json.output">
    <div class="virtual-titles-result">
        <div class="browser-reset flex-center">
            <p class="align-left">{{response_json.fetched}}/{{response_json.total}} Screenshots Generated
            <br>
            <span>{{response_json.desktop}} Desktop {{response_json.mobile_count}} Mobile/Tablet</span>
            </p>
        </div>
        <a :href="'<?php echo $lt_falcon_url;?>/zipper/'+response_json.test_id" target="_blank" class="virtual-settings-btn flex-center" style="display: inline; padding: 6px 10px 6px;">
            <span >Download All</span>
            <div class="iconDown"></div>
        </a>
        <div class="flex-center">
            <div class="flex-center">
            URL : &nbsp; &nbsp;<a href="<?php echo isset($_GET['url']) ? esc_attr($_GET['url']) : ''; ?>" target="_blank"><?php echo isset($_GET['url']) ? esc_html($_GET['url']) : ''; ?> </a>
            </div>
        </div>

        <div class="clear-fix"></div>
    </div>
    <div class="table-container device-desktop">
        <table border="0">
            <tbody v-if="response_json.output">

                <tr v-if="response_json.output.ios.length > 0">
                    <td class="browserIcon" valign="top">
                        <div class="icons-2 sprite-vrtual ios"></div>
                    </td>
                    <td class="ResultWrap" v-for="(ios_element,index) in response_json.output.ios" :key="index">
                        <div class="ResultWrap">
                            <div class="ResultImg" @click="startSliderImg(ios_element.activity_id,ios_element.screenshots.length > 0 ? ios_element.screenshots[0].thumb_url:'')">
                                <img class="hover-shadow cursor" :src="ios_element.screenshots.length > 0 ? ios_element.screenshots[0].thumb_url:''">
                                <div class="deviceIcon">
                                    <div class="iconmobile">
                                    </div>
                                    <div v-if="ios_element.screenshots.length === 0" class="xloader"></div>
                                </div>
                            </div>
                        <div>
                            <div class="resultDetail">
                                <div v-text="response_json.os_versions[ios_element.os_version_id].name"></div>
                                <div class="no-wrap" v-text="response_json.devices[ios_element.device_id].name"></div>
                            </div>
                            <div class="resultDown">
                                <a v-if="ios_element.screenshots.length > 0" class="iconDown" :href="ios_element.screenshots[0].screenshot_url" target="_blank" download></a>
                                <a class="iconDown" v-else></a>
                            </div>
                        </div>
                        </div>
                    </td>
                </tr>

                <tr v-if="response_json.output.android.length > 0">
                    <td class="browserIcon" valign="top">
                        <div class="icons-2 sprite-vrtual android"></div>
                    </td>
                    <td class="ResultWrap" v-for="(android_element,index) in response_json.output.android" :key="index">
                        <div class="ResultWrap">
                        <div class="ResultImg" @click="startSliderImg(android_element.activity_id,android_element.screenshots.length > 0 ? android_element.screenshots[0].thumb_url:'')">
                            <img class="hover-shadow cursor" :src="android_element.screenshots.length > 0 ? android_element.screenshots[0].thumb_url:''">

                            <div class="deviceIcon">
                                <div class="iconmobile"></div>
                                <div v-if="android_element.screenshots.length === 0" class="xloader"></div>
                            </div>

                        </div>
                        <div>
                            <div class="resultDetail">
                                <div v-text="response_json.os_versions[android_element.os_version_id].name"></div>
                                <div class="no-wrap" v-text="response_json.devices[android_element.device_id].name"></div>
                            </div>
                            <div class="resultDown">
                                <a v-if="android_element.screenshots.length > 0" class="iconDown" :href="android_element.screenshots[0].screenshot_url" target="_blank" download></a>
                                <a class="iconDown" v-else></a>
                            </div>
                        </div>
                        </div>
                    </td>
                </tr>

                <tr v-if="Object.keys(response_json.output.desktop).length > 0" v-for="(browser, propertyName) in response_json.output.desktop">
                    <td class="browserIcon" valign="top">
                        <div :class="'sprite-history '+response_json.browsers[propertyName].image+'-large'"></div>
                    </td>
                    <td class="ResultWrap" v-if="browser.length > 0" v-for="(browser_element, browser_index) in browser" :key="browser_index">
                        <div class="ResultWrap">
                        <div class="ResultImg" @click="startSliderImg(browser_element.activity_id,browser_element.screenshots.length > 0 ? browser_element.screenshots[0].thumb_url:'')">
                            <img class="hover-shadow cursor" :src="browser_element.screenshots.length > 0 ? browser_element.screenshots[0].thumb_url:''">

                            <div class="deviceIcon">
                                <div class="iconDesk"></div>
                                <div v-if="browser_element.screenshots.length === 0" class="xloader"></div>
                            </div>
                        </div>
                        <div>
                            <div class="resultDetail">
                                <div v-text="response_json.browsers[browser_element.browser_id].name + ' '+ response_json.browser_versions[browser_element.browser_version_id].version_no"></div>
                                <div class="no-wrap" v-text="response_json.os_versions[browser_element.os_version_id].name"></div>
                            </div>
                            <div class="resultDown">
                                <a v-if="browser_element.screenshots.length > 0" class="iconDown" :href="browser_element.screenshots[0].screenshot_url" target="_blank" download></a>
                                <a class="iconDown" v-else></a>
                            </div>
                        </div>
                        </div>
                    </td>
                    <td>
                    </td>
                </tr>

            </tbody>
        </table>
    </div>
</div>
