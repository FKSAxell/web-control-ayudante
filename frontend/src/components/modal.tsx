import React from 'react'

export interface ModalProps {
    content: React.ReactElement
    background: boolean
}

export default function Modal(props: ModalProps): React.ReactElement {
    if(props.background) {
        return (
            <div className="w3-modal" style={{ display: 'block', zIndex: 100 }}>
                <div className="w3-modal-content">
                    <div className="w3-container">
                        {props.content}
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="w3-modal" style={{ display: 'block', zIndex: 100 }}>
            {props.content}
        </div>
    )
}
