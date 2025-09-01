import './css/loading.css'

interface LoadingProps {
    size?: 'small' | 'medium' | 'large'
    message?: string
    fullScreen?: boolean
    variant?: 'primary' | 'secondary' | 'celifrut'
}

export function Loading({ 
    size = 'medium', 
    message, 
    fullScreen = false, 
    variant = 'celifrut' 
}: LoadingProps) {
    const containerClass = fullScreen ? 'loading-container loading-fullscreen' : 'loading-container'
    
    return (
        <div className={containerClass}>
            <div className="loading-content">
                <div className={`loading-spinner loading-spinner--${size} loading-spinner--${variant}`}>
                    <div className="spinner-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
                {message && (
                    <p className="loading-message">{message}</p>
                )}
            </div>
        </div>
    )
}