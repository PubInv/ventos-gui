import { Formik, Form, Field,
  // ErrorMessage
  } from 'formik';

export default function ServerConfigForm({dispatch, ventilator_session}) {

const initialValues=ventilator_session

return <Formik
        initialValues={initialValues}
      onSubmit={async (values) => {
        dispatch({type: 'patch', value: {ventilator_session: values}})
        //await new Promise((r) => setTimeout(r, 500));
        //alert(JSON.stringify(values, null, 2));
      }}
    >
    <Form>

   <div className="mb-3">
    <label className='form-label' htmlFor="dserverurl">Server URL:</label>
    <Field className='form-control' type="url" id="dserverurl" name="dserverurl" />
  </div>

  <div className="mb-3">
    <label className='form-label' htmlFor="traceid">Trace ID:</label>
    <Field className='form-control' type="text" id="traceid" name="traceid" />
  </div>

  <div className="mb-3">
    <label className='form-label' htmlFor="samples_to_plot">
        Number of Samples (~10s per 15000 samples):
    </label>
    <Field className='form-control' type="text" id="samples_to_plot" name="samples_to_plot" />
  </div>

    <button type="submit" className='btn btn-info'>
      Update
    </button>
  </Form>
</Formik>
}
