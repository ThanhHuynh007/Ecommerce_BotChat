import React from 'react'
import Header from '../HeaderComponent/Header'

const Default = ({children}) => {
  return (
    <div>
        <Header />
        {children}
    </div>
  )
}

export default Default