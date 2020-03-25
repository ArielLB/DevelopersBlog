import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
const format = 'DD/MM/YYYY';

const ProfileEducation = ({education : {school, degree, fieldofstudy, to, from ,description}}) => {
    return (
        <div>
           <h3 className='text-dark'>{school}</h3>
           <p>
             <Moment format={format}>{from}</Moment> - {!to ? ' Now' : <Moment format={format}>{to}</Moment>}
          </p>
          <p>
              <strong>Degree: </strong> {degree}
         </p>
         <p>
              <strong>Field of study: </strong> {fieldofstudy}
         </p>
         <p>
             <strong>Description: </strong> {description}
        </p> 
        </div>
    )
}

ProfileEducation.propTypes = {
    education: PropTypes.array.isRequired
}

export default ProfileEducation
