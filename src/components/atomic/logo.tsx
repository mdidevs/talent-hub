import logoSrc from '../../assets/cubicles.svg'

export const Logo = () => {
  return (
    <div className='flex items-center space-x-2'>
        <img src={logoSrc} alt="Logo" className="h-8 w-auto"/>
        <h1 className="text-xl font-bold">Cubicles</h1>
    </div>
  )
}
