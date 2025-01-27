(function (window) {
  window.__env = window.__env || {};
  window.__env.build_json = {
    "enterprise_id": "",
    "enterprise_name": "vhizle",
    "short_name": "vhizle",
    "S3URL": "https://srisys-allapps-nonprod-assets.s3.ap-south-1.amazonaws.com/QA/",
    "load_landing_page_without_login": true,
    "is_guest_user_link_enable": false,
    "is_sync_enable": false,
    "is_registration_link_enable": true,
    "is_all_enterprises_link_enable": false,
    "notification_count_interval": 30000,
    "show_header_languages_list": true,
    "leader_board_refresh_scroll_time_interval": 5000,
    "policy_urls": {
      "privacy_policy_url": "https://vhizle.com/privacy-policy/",
      "terms_of_use_url": "https://vhizle.com/terms/",
      "cookies_policy_url": "https://vhizle.com/cookies-policy/",
    },
    "map_view_popup_position": "pcenter", // Utilize the classes (ptop, pbottom, pleft, pright, pcenter) to adjust the positioning of the 'Detail Popup'.
    "grid_full_images": "grid-full-images", // To display a full-sized image in a grid view, use the 'grid-full-images' option. For a circular image, simply use an empty string ('').
    "is_offline_application": false, // For specific apk
    "is_search_drop_down_field": false, // For DC-Sport - Golf Games
    "is_inapp_user_guide_enable": false,
  };
  window.__env.instances = {
    uat: {
      apiUrl: 'https://pigeon-uat-api.pigeon-tech.com/',
      domainUrl: 'https://pigeon-uat.pigeon-tech.com/',
      socketDomainUrl: 'https://pigeon-uat-socket.pigeon-tech.com/',
      instanceDataType: 'PROD' //PROD or DEMO
    },
    duat: {
      apiUrl: 'https://pigeon-duat-api.pigeon-tech.com/',
      domainUrl: 'https://pigeon-duat.pigeon-tech.com/',
      socketDomainUrl: 'https://pigeon-duat-socket.pigeon-tech.com/',
      instanceDataType: 'DEMO' //PROD or DEMO
    },
    psup: {
      apiUrl: 'https://pigeon-psup-api.pigeon-tech.com/',
      domainUrl: 'https://pigeon-psup.pigeon-tech.com/',
      socketDomainUrl: 'https://pigeon-psup-socket.pigeon-tech.com/',
      instanceDataType: 'PROD' //PROD or DEMO
    },
    dsup: {
      apiUrl: 'https://pigeon-dsup-api.pigeon-tech.com/',
      domainUrl: 'https://pigeon-dsup.pigeon-tech.com/',
      socketDomainUrl: 'https://pigeon-dsup-socket.pigeon-tech.com/',
      instanceDataType: 'DEMO' //PROD or DEMO
    },
    dev: {
      apiUrl: 'https://pigeon-dev-api.pigeon-tech.com/',
      domainUrl: 'https://pigeon-dev.pigeon-tech.com/',
      socketDomainUrl: 'https://pigeon-dev-socket.pigeon-tech.com/',
      instanceDataType: 'PROD' //PROD or DEMO
    },
    qa: {
      apiUrl: 'https://pigeon-qa-api.pigeon-tech.com/',
      domainUrl: 'https://pigeon-qa.pigeon-tech.com/',
      socketDomainUrl: 'https://pigeon-qa-socket.pigeon-tech.com/',
      instanceDataType: 'DEMO' //PROD or DEMO
    },
    pqa: {
      apiUrl: 'https://pigeon-pqa-api.pigeon-tech.com/',
      domainUrl: 'https://pigeon-pqa.pigeon-tech.com/',
      socketDomainUrl: 'https://pigeon-pqa-socket.pigeon-tech.com/',
      instanceDataType: 'PROD'  //PROD or DEMO
    },
    local: {
      apiUrl: 'http://localhost:3000/',
      domainUrl: 'http://localhost:8100/',
      socketDomainUrl: 'http://localhost:3000/',
      instanceDataType: 'DEMO'  //PROD or DEMO
    }
  };
  window.__env.instance = 'pqa'; // uat, psup, dsup, local
}(this));
