import { createElement } from '@wordpress/element'
import { useSelect, useDispatch } from '@wordpress/data'
import { NoticeList } from '@wordpress/components'

export default function Notices() {
    const notices = useSelect((select) => select('core/notices').getNotices())
    const { removeNotice } = useDispatch('core/notices')

    return (
        <NoticeList
            className="edit-site-notices"
            //@ts-ignore
            notices={notices}
            onRemove={removeNotice}
        />
    );
}