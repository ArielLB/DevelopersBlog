import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
const format = 'DD/MM/YYYY';

const ProfileExperience = ({experience : {company, title, location, to, from ,description}}) => {
    return (
        <div>
           <h3 className='text-dark'>{company}</h3>
           <p>
             <Moment format={format}>{from}</Moment> - {!to ? ' Now' : <Moment format={format}>{to}</Moment>}
          </p>
          <p>
              <strong>Position: </strong> {title}
         </p>
         <p>
             <strong>Description: </strong> {description}
        </p> 
        </div>
    )
}

ProfileExperience.propTypes = {
    experience: PropTypes.array.isRequired
}

export default ProfileExperience
