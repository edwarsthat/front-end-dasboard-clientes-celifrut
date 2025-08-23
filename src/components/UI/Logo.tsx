import logoImage from '../../assets/1.webp'
import { config } from '../../config/env'

interface LogoProps {
    title?: string;
    className?: string;
}

export function Logo({ title, className = "" }: LogoProps) {
    // Usar el nombre de la app desde las variables de entorno si no se proporciona título
    const displayTitle = title ?? config.app.name
    
    return (
        <div className={`logo-section ${className}`}>
            <div className="logo-wrapper">
                <img src={logoImage} alt="Celifrut Logo" className="logo-image" />
            </div>
            <p>{displayTitle}</p>
        </div>
    )
}
