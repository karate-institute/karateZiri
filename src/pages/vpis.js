import React, { useState } from 'react';
import Layout from '../components/Layout';
import Parse from 'parse';
import Seo from '../components/Seo';
import ClipLoader from 'react-spinners/ClipLoader';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9]{7,15}$/;

const Vpis = () => {
  const initialFields = {
    ime: '',
    priimek: '',
    'naslov-bivalisca': '',
    'postna-st': '',
    kraj: '',
    'datum-rojstva': '',
    telefon: '',
    email: '',
    tecaj: [],
    obisk: [],
    'druzinski-clani': '',
    dovoljenje: [],
    zastopnik: '',
    priporocilo: '',
    strinjanje: [],
  };

  const [fields, setFields] = useState(initialFields);
  const [isEdit, setIsEdit] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [nameValid, setNameValid] = useState(true);
  const [surnameValid, setSurnameValid] = useState(true);
  const [addressValid, setAddressValid] = useState(true);
  const [cityNumValid, setCityNumValid] = useState(true);
  const [cityValid, setCityValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);
  const [dobValid, setDobValid] = useState(true);
  const [courseValid, setCourseValid] = useState(true);
  const [attendanceValid, setAttendanceValid] = useState(true);
  const [allowValid, setAllowValid] = useState(true);
  const [formValid, setFormValid] = useState(true);
  const [agreementValid, setAgreementValid] = useState(true);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Reset error and success messages when user starts typing
    setFormValid(true);
    setSubmissionSuccess(false);

    if (name === 'email') {
      setIsEdit(true);
      setEmailValid(value.trim() === '' || emailRegex.test(value));
    }
    if (name === 'ime') {
      setIsEdit(true);
      setNameValid(value.trim() !== '');
    }
    if (name === 'priimek') {
      setIsEdit(true);
      setSurnameValid(value.trim() !== '');
    }
    if (name === 'naslov-bivalisca') {
      setIsEdit(true);
      setAddressValid(value.trim() !== '');
    }
    if (name === 'postna-st') {
      setIsEdit(true);
      setCityNumValid(value.trim() !== '');
    }
    if (name === 'kraj') {
      setIsEdit(true);
      setCityValid(value.trim() !== '');
    }
    if (name === 'telefon') {
      setIsEdit(true);
      setPhoneValid(value.trim() === '' || phoneRegex.test(value));
    }
    if (name === 'datum-rojstva') {
      setIsEdit(true);
      setDobValid(value.trim() !== '');
    }
    if (name === 'tecaj') {
      setIsEdit(true);
      setCourseValid(fields.tecaj.length > 0 || checked);
    }
    if (name === 'obisk') {
      setIsEdit(true);
      setAttendanceValid(fields.obisk.length > 0 || checked);
    }
    if (name === 'dovoljenje') {
      setIsEdit(true);
      setAllowValid(fields.dovoljenje.length > 0 || checked);
    }
    if (name === 'strinjanje') {
      setIsEdit(true);
      setAgreementValid(fields.strinjanje.length > 0 || checked);
    }

    if (type === 'checkbox' || type === 'radio') {
      if (checked) {
        setFields((prevFields) => ({
          ...prevFields,
          [name]: type === 'radio' ? [value] : [...prevFields[name], value],
        }));
      } else {
        setFields((prevFields) => ({
          ...prevFields,
          [name]: prevFields[name].filter((item) => item !== value),
        }));
      }
    } else {
      setFields((prevFields) => ({
        ...prevFields,
        [name]: value,
      }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    if (name === 'email') {
      setIsEdit(false);
      setEmailValid(value.trim() !== '' && emailRegex.test(value));
    }
    if (name === 'ime') {
      setIsEdit(false);
      setNameValid(value.trim() !== '');
    }
    if (name === 'priimek') {
      setIsEdit(false);
      setSurnameValid(value.trim() !== '');
    }
    if (name === 'naslov-bivalisca') {
      setIsEdit(false);
      setAddressValid(value.trim() !== '');
    }
    if (name === 'postna-st') {
      setIsEdit(false);
      setCityNumValid(value.trim() !== '');
    }
    if (name === 'kraj') {
      setIsEdit(false);
      setCityValid(value.trim() !== '');
    }
    if (name === 'telefon') {
      setIsEdit(false);
      setPhoneValid(value.trim() !== '' && phoneRegex.test(value));
    }
    if (name === 'datum-rojstva') {
      setIsEdit(false);
      setDobValid(value.trim() !== '');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = validateAllFields();
    if (!isValid) {
      setFormValid(false);
      return;
    }

    setFormValid(true);
    setLoading(true);

    const currentDateTime = new Date().toISOString();
    const datePart = currentDateTime.split('T')[0];
    const dateObj = new Date(datePart);
    const dateSubmitted = dateObj.toDateString().split(' ').splice(1).join(' ');

    const datumRojstvaDateObj = new Date(fields['datum-rojstva']);
    const datumRojstvaFormatted = datumRojstvaDateObj
      .toDateString()
      .split(' ')
      .splice(1)
      .join(' ');

    const updatedFields = {
      ...fields,
      'datum-prijave': dateSubmitted,
      'datum-rojstva': datumRojstvaFormatted,
    };

    console.log('Form Data:', updatedFields);

    try {
      console.log('Sending Data:', { fields: updatedFields });
      await Parse.Cloud.run('sendEmail', {
        fields: updatedFields,
      });
      // alert(result);
      // Reset fields after successful submission
      setFields(initialFields);

      setSubmissionSuccess(true); // Set submission success state
    } catch (error) {
      console.error('Error sending email:', error.message);
      alert(`Failed to send email: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const validateAllFields = () => {
    const isNameValid = fields.ime.trim() !== '';
    const isSurnameValid = fields.priimek.trim() !== '';
    const isAddressValid = fields['naslov-bivalisca'].trim() !== '';
    const isCityNumValid = fields['postna-st'].trim() !== '';
    const isCityValid = fields.kraj.trim() !== '';
    const isPhoneValid = phoneRegex.test(fields.telefon);
    const isEmailValid = emailRegex.test(fields.email);
    const isDobValid = fields['datum-rojstva'].trim() !== '';
    const isCourseValid = fields.tecaj.length > 0;
    const isAttendanceValid = fields.obisk.length > 0;
    const isAllowValid = fields.dovoljenje.length > 0;
    const isAgreementValid = fields.strinjanje[0] === 'da';

    setNameValid(isNameValid);
    setSurnameValid(isSurnameValid);
    setAddressValid(isAddressValid);
    setCityNumValid(isCityNumValid);
    setCityValid(isCityValid);
    setPhoneValid(isPhoneValid);
    setEmailValid(isEmailValid);
    setDobValid(isDobValid);
    setCourseValid(isCourseValid);
    setAttendanceValid(isAttendanceValid);
    setAllowValid(isAllowValid);
    setAgreementValid(isAgreementValid)

    return (
      isNameValid &&
      isSurnameValid &&
      isAddressValid &&
      isCityNumValid &&
      isCityValid &&
      isPhoneValid &&
      isEmailValid &&
      isDobValid &&
      isCourseValid &&
      isAttendanceValid &&
      isAllowValid &&
      isAgreementValid
    );
  };

  return (
    <Layout>
      <div className='bg-layout2 font-oswald  text-text1 px-10 flex flex-col items-center  py-10 md:py-40'>
        <form
          className='flex flex-col max-w-[30rem]'
          action='/submit'
          method='post'
          onSubmit={handleSubmit}
        >
          <label htmlFor='ime' className='mb-1'>
            IME*
          </label>
          <input
            type='text'
            id='ime'
            name='ime'
            className='mb-3 px-1 text-black'
            value={fields.ime}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div>
            {!nameValid && (
              <p className='text-red-500 mb-5'>Prosim vnesite ime.</p>
            )}
          </div>

          <label htmlFor='priimek' className='mb-1'>
            PRIIMEK*
          </label>
          <input
            type='text'
            id='priimek'
            name='priimek'
            className='mb-3 px-1 text-black'
            value={fields.priimek}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div>
            {!surnameValid && (
              <p className='text-red-500 mb-5'>Prosim vnesite priimek.</p>
            )}
          </div>

          <label htmlFor='naslov-bivalisca' className='mb-1'>
            NASLOV BIVALIŠČA*
          </label>
          <input
            type='text'
            id='naslov-bivalisca'
            name='naslov-bivalisca'
            className='mb-3 px-1 text-black'
            value={fields['naslov-bivalisca']}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div>
            {!addressValid && !isEdit && (
              <p className='text-red-500 mb-5'>Prosim vnesite ime ulice.</p>
            )}
          </div>

          <label htmlFor='postna-st' className='mb-1'>
            POŠTNA ŠT.*
          </label>
          <input
            type='number'
            id='postna-st'
            name='postna-st'
            className='mb-3 px-1 text-black'
            value={fields['postna-st']}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div>
            {!cityNumValid && !isEdit && (
              <p className='text-red-500 mb-5'>
                Prosim vnesite poštno številko.
              </p>
            )}
          </div>

          <label htmlFor='kraj' className='mb-1'>
            KRAJ*
          </label>
          <input
            type='text'
            id='kraj'
            name='kraj'
            className='mb-3 px-1 text-black'
            value={fields.kraj}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div>
            {!cityValid && !isEdit && (
              <p className='text-red-500 mb-5'>Prosim vnesite kraj.</p>
            )}
          </div>

          <label htmlFor='datum-rojstva' className='mb-1'>
            DATUM ROJSTVA*
          </label>
          <input
            type='date'
            id='datum-rojstva'
            name='datum-rojstva'
            className='mb-3 text-black px-1'
            value={fields['datum-rojstva']}
            onChange={handleChange}
          />
          <div>
            {!dobValid && !isEdit && (
              <p className='text-red-500 mb-5'>
                Prosim izberite datum rojstva.
              </p>
            )}
          </div>

          <label htmlFor='telefon' className='mb-1'>
            ŠT. MOBILNEGA TELEFONA (za pošiljanje obvestil po SMS)*
          </label>
          <input
            type='number'
            id='telefon'
            name='telefon'
            className='mb-3 text-black px-1'
            value={fields.telefon}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div>
            {!phoneValid && !isEdit && (
              <p className='text-red-500 mb-5'>
                Prosim vnesite veljavno številko telefona.
              </p>
            )}
          </div>

          <label htmlFor='email' className='mb-1'>
            ELEKTRONSKA POŠTA*
          </label>
          <input
            type='email'
            id='email'
            name='email'
            className='mb-3 text-black px-1'
            value={fields.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div>
            {!emailValid && !isEdit && (
              <p className='text-red-500 mb-5'>
                Prosim vnesite veljaven elektronski naslov.
              </p>
            )}
          </div>

          <span className='mb-1'>VPISUJEM SE V TEČAJ*</span>
          <div>
            <input
              type='radio'
              id='mladostniki'
              name='tecaj'
              value='mladostniki'
              checked={fields.tecaj.includes('mladostniki')}
              className='mb-3'
              onChange={handleChange}
            />
            <label htmlFor='mladostniki' className='m-1'>
              Karate otroci in mladostniki
            </label>
          </div>
          <div className='mb-3'>
            <input
              type='radio'
              id='odrasli'
              name='tecaj'
              value='odrasli'
              checked={fields.tecaj.includes('odrasli')}
              className='mb-3'
              onChange={handleChange}
            />
            <label htmlFor='odrasli' className='m-1'>
              Karate odrasli
            </label>
          </div>
          <div>
            {!courseValid && !isEdit && (
              <p className='text-red-500 mb-5'>Prosim izberite tečaj.</p>
            )}
          </div>

          <span className='mb-1'>TEČAJ BOM OBISKOVAL (TEDENSKO)*</span>
          <div className='mb-1'>
            <input
              type='radio'
              id='3x'
              name='obisk'
              value='3x'
              checked={fields.obisk.includes('3x')}
              onChange={handleChange}
            />
            <label htmlFor='3x' className='m-1'>
              3x ali več (kombinacija s kickboxom)
            </label>
          </div>
          <div className='mb-1'>
            <input
              type='radio'
              id='2x'
              name='obisk'
              value='2x'
              checked={fields.obisk.includes('2x')}
              onChange={handleChange}
            />
            <label htmlFor='2x' className='m-1'>
              2x
            </label>
          </div>
          <div>
            <input
              type='radio'
              id='1x'
              name='obisk'
              value='1x'
              checked={fields.obisk.includes('1x')}
              onChange={handleChange}
            />
            <label htmlFor='1x' className='m-1'>
              1x
            </label>
          </div>

          <div>
            {!attendanceValid && !isEdit && (
              <p className='text-red-500 mb-5'>
                Prosim izberite frekvenco obiska.
              </p>
            )}
          </div>

          <label htmlFor='druzinski-clani' className='mt-3 mb-1'>
            VPIŠITE IMENA DRUGIH DRUŽINSKIH ČLANOV, KI SO VKLJUČENI V NAŠE
            PROGRAME (upoštevanje popusta)
          </label>
          <textarea
            id='druzinski-clani'
            name='druzinski-clani'
            className=' text-black px-1 mb-5'
            onChange={handleChange}
          ></textarea>

          <label htmlFor='zastopnik' className='mb-1'>
            ZASTOPNIK (če si mladoleten/a, vpiši ime in priimek starša oz.
            zakonitega zastopnika)
          </label>
          <input
            type='text'
            id='zastopnik'
            name='zastopnik'
            className=' px-1 text-black mb-5'
            onChange={handleChange}
          />

          <label htmlFor='priporocilo' className='mb-1'>
            KAKO STE IZVEDELI ZA NAS? (splet, prijatelji, Facebook, Instagram,
            drugo)
          </label>
          <textarea
            id='priporocilo'
            name='priporocilo'
            className=' text-black px-1 mb-5'
            onChange={handleChange}
          ></textarea>

          <span htmlFor='dovoljenje' className='mb-1'>
            Dovoljujem, da se izpolnjeni podatki in podatki o mojih tekmovalnih
            uspehih ter fotografije s tekmovanj ali treningov uporabljajo za
            potrebe, Karate kluba Kolektor Idrija, Karate kluba Cerkno ali
            Karate kluba Žiri. *
          </span>
          <div>
            <input
              type='radio'
              id='da'
              name='dovoljenje'
              value='da'
              className='mb-3'
              checked={fields.dovoljenje.includes('da')}
              onChange={handleChange}
            />
            <label htmlFor='da' className='m-1'>
              DA
            </label>
          </div>
          <div className='mb-3'>
            <input
              type='radio'
              id='ne'
              name='dovoljenje'
              value='ne'
              className='mb-3'
              checked={fields.dovoljenje.includes('ne')}
              onChange={handleChange}
            />
            <label htmlFor='ne' className='m-1'>
              NE
            </label>
          </div>

          <div>
            {!allowValid && (
              <p className='text-red-500 mb-5'>Prosimo, izberite.</p>
            )}
          </div>

          <span htmlFor='strinjanje' className='mb-1'>
            Karate klub Žiri uporablja aplikacijo Moje spretnosti za vodenje
            evidenc, obveščanje, zapisovanje rezultatov testiranj in izpitov,
            objavljanje izobraževalnih vsebin in izdajanje računov. S podpisom
            tega vpisnega lista se strinjate, da bo administrator v klubu vam
            ali vašemu varovancu v aplikaciji Moje Spretnosti kreiral
            uporabniški račun. Z namenom nemotenega delovanje kluba in vodenje
            načrtovanega vadbeno vzgojnega procesa v Karate klubu Žiri obdeluje
            naslednje podatke:
            <ul>
              <li>
                Podatke o vašem imenu in priimku ter naslovu zbiramo zaradi
                priprave pogodbe in izdaje računov;
              </li>
              <li>
                Podatke o vašem imenu in priimku ter naslovu zbiramo zaradi
                priprave pogodbe in izdaje računov;
              </li>
              <li>
                Podatke o imenu in priimku ter starosti otroka zbiramo zaradi
                izvedbe programa, razvrščanja v ustrezne skupine;
              </li>
              <li>
                Podatke o telefonski številki zbiramo zaradi možnosti obveščanja
                o morebitnih odpovedih ali spremembah v zvezi s tečajem iz
                kakršnihkoli razlogov;
              </li>
              <li>
                Podatke o elektronskem naslovu zbiramo, z namenom kreiranja up.
                računa v aplikaciji Moje spretnosti, zaradi obveščanja o
                novostih, posredovanju informacij, obveščanja o spremembah,
                obveščanju o tekmovanjih in dogodkih na nivoju kluba ali Karate
                Zveze Slovenije, za obveščanje članov o začetku nove sezone in
                razporeditvi v nove skupine in obveščanje članov o novih vpisih
                ob začetku sezone;
              </li>
              <li>
                Podatke o boleznih in posebnih stanjih zbiramo zato, da se lahko
                trener v primeru zapletov ustrezno odzove;
              </li>
              <li>
                Podatke o ocenah izpitov, rezultate tekmovanj in testiranj,
                zbiramo z namenom spremljanja in načrtovanja vadbenega procesa.
                Rezultate s tekmovanj uporabljamo tudi pri prijavi na občinske
                razpise za sofinanciranje športa ter jih objavljamo v javnih
                medijih;
              </li>
              <li>
                Podatke o enotni matični številki in številki zdravstvenega
                zavarovanja zbiramo v primeru registracije naših članov v
                nacionalno panožno zvezo. Izjavo o varovanju osebnih podatkov v
                Karate klubu Žiri in pogojih uporabe aplikacije Moje spretnosti
                si lahko preberete na naši spletni strani 
                <a
                  href='https://www.karate-institute.org/izjava-karate-klub-kolektor/'
                  target='_blank'
                  rel='noreferrer'
                  className='text-blue-700'
                >
                  Karate Institute
                </a>
                . *
              </li>
            </ul>
          </span>
          <div>
            <input
              type='radio'
              id='da'
              name='strinjanje'
              value='da'
              className='mb-3'
              checked={fields.strinjanje.includes('da')}
              onChange={handleChange}
            />
            <label htmlFor='da' className='m-1'>
              Se strinjam
            </label>
          </div>
          <div className='mb-3'>
            <input
              type='radio'
              id='ne'
              name='strinjanje'
              value='ne'
              className='mb-3'
              checked={fields.strinjanje.includes('ne')}
              onChange={handleChange}
            />
            <label htmlFor='ne' className='m-1'>
              Se ne strinjam
            </label>
          </div>

          <div>
            {!agreementValid && (
              <p className='text-red-500 mb-5'>Za upsešno prijavo se je potrebno strinjati.</p>
            )}
          </div>

          <button
            type='submit'
            className='mx-auto w-32 bg-identifier border-4 border-identifier rounded-sm py-3 px-6 text-xl cursor-pointer hover:text-text1 hover:bg-transparent transition-colors duration-200 ease-in-out`'
          >
            {loading ? <ClipLoader size={24} color='#ffffff' /> : 'Prijava'}
          </button>

          {!formValid && (
            <p className='text-red-500 mt-3 text-center'>
              Prosim izpolnite vsa obvezna polja.
            </p>
          )}
          {submissionSuccess && formValid && (
            <p className='text-green-500 mt-3 text-center'>
              Prijava je bila uspešno poslana!
            </p>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default Vpis;

export const Head = () => (
  <Seo
    title='Vpis'
    description='Sign up for our martial arts programs today. Join us to develop your skills in a supportive environment. Start your journey towards fitness, confidence, and personal growth.'
  />
);
