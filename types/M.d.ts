declare namespace M {
    type userInfo = {
        data?: {
            user: User;
            statuses: Status[];
            more: string;
            fans: string;
            follow: string;
            button: Button;
        },
        ok: number;
    }
}

export type Button = {
    type: string;
    name: string;
    sub_type: number;
    params: Params;
}

export type Params = {
    uid: string;
}

export type Status = {
    visible: Visible;
    created_at: string;
    id: string;
    mid: string;
    can_edit: boolean;
    show_additional_indication: number;
    text: string;
    textLength: number;
    source: string;
    favorited: boolean;
    pic_ids: string[];
    pic_focus_point?: PicFocusPoint[];
    falls_pic_focus_point?: any[];
    pic_rectangle_object?: PicRectangleObject[];
    pic_flag?: number;
    thumbnail_pic?: string;
    bmiddle_pic?: string;
    original_pic?: string;
    is_paid: boolean;
    mblog_vip_type: number;
    user: User;
    pic_video?: string;
    picStatus?: string;
    reposts_count: number;
    comments_count: number;
    reprint_cmt_count: number;
    attitudes_count: number;
    pending_approval_count: number;
    isLongText: boolean;
    mlevel: number;
    show_mlevel: number;
    darwin_tags: any[];
    hot_page: HotPage;
    mblogtype: number;
    rid: string;
    number_display_strategy: NumberDisplayStrategy;
    content_auth: number;
    bus_flag: number;
    safe_tags?: number;
    comment_manage_info: CommentManageInfo;
    pic_num: number;
    new_comment_style: number;
    ab_switcher: number;
    region_name: string;
    region_opt: number;
    page_info: PageInfo;
    pics?: Pic[];
    live_photo?: string[];
    bid: string;
}

export type CommentManageInfo = {
    comment_permission_type: number;
    approval_comment_type: number;
    comment_sort_type: number;
}

export type HotPage = {
    fid: string;
    feed_detail_type: number;
}

export type NumberDisplayStrategy = {
    apply_scenario_flag: number;
    display_text_min_number: number;
    display_text: string;
}

export type PageInfo = {
    type: string;
    icon: string;
    page_pic: PagePic;
    page_url: string;
    page_title: string;
    content1: string;
    content2: string;
}

export type PagePic = {
    url: string;
    width: string;
    height: string;
}

export type PicFocusPoint = {
    focus_point: FocusPoint;
    pic_id: string;
}

export type FocusPoint = {
    left: number;
    top: number;
    width: number;
    height: number;
    type?: number;
}

export type PicRectangleObject = {
    rectangle_objects: FocusPoint[];
    pic_id: string;
}

export type Pic = {
    pid: string;
    url: string;
    size: string;
    geo: PicGeo;
    large: Large;
    videoSrc?: string;
    type?: string;
}

export type PicGeo = {
    width: number;
    height: number;
    croped: boolean;
}

export type Large = {
    size: string;
    url: string;
    geo: LargeGeo;
}

export type LargeGeo = {
    width: number | string;
    height: number | string;
    croped: boolean;
}

export type User = {
    id: number;
    screen_name: string;
    profile_image_url: string;
    profile_url: string;
    statuses_count: number;
    verified: boolean;
    verified_type: number;
    close_blue_v: boolean;
    description: string;
    gender: string;
    mbtype: number;
    svip: number;
    urank: number;
    mbrank: number;
    follow_me: boolean;
    following: boolean;
    follow_count: number;
    followers_count: string;
    followers_count_str: string;
    cover_image_phone: string;
    avatar_hd: string;
    like: boolean;
    like_me: boolean;
    badge?: Badge;
}

export type Badge = {
    user_name_certificate: number;
    city_university: number;
}

export type Visible = {
    type: number;
    list_id: number;
}
